/*
 * ***** BEGIN GPL LICENSE BLOCK *****
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301, USA.
 *
 * The Original Code is Copyright (C) 2009 Blender Foundation, Joshua Leung
 * All rights reserved.
 *
 * The Original Code is: all of this file.
 *
 * Contributor(s): Joshua Leung (full recode), Max Goodman (JS port)
 *
 * ***** END GPL LICENSE BLOCK *****
 */

// Ported from blender-2.78c/source/blender/blenkernel/intern/fcurve.c.
// The original code is licensed GPL so the port is as well.
// Formatting and code organization has been kept as similar to the old code as possible.
// Only bezier interpolation is fully supported. other modes could be added in the future.

const SMALL = -1e-10
const acos = Math.acos
const cos = Math.cos
const fabsf = Math.abs
const sqrt = Math.sqrt
const FLT_EPSILON = Number.EPSILON

const FCURVE_EXTRAPOLATE_LINEAR = 'LINEAR'
const BEZT_IPO_CONST = 'CONSTANT'
const BEZT_IPO_LIN = 'LINEAR'
const BEZT_IPO_BEZ = 'BEZIER'

function IS_EQT(a, b, c) {
  return a > b ? a - b <= c : b - a <= c
}

function sqrt3d(x) {
  if (x === 0) {
    return 0
  } else if (x < 0) {
    return -Math.exp(Math.log(-x) / 3)
  } else {
    return Math.exp(Math.log(x) / 3)
  }
}

/* Binary search algorithm for finding where to insert BezTriple, with optional argument for precision required.
 * Returns the index to insert at (data already at that index will be offset if replace is 0)
 */
function binarysearch_bezt_index_ex(array, frame, threshold) {
  const arraylen = array.length
  let start = 0, end = arraylen
  let loopbreaker = 0, maxloop = arraylen * 2

  /* sneaky optimizations (don't go through searching process if...):
   *  - keyframe to be added is to be added out of current bounds
   *  - keyframe to be added would replace one of the existing ones on bounds
   */
  if ((arraylen <= 0) || (array == null)) {
    //console.warn("Warning: binarysearch_bezt_index() encountered invalid array\n")
    return {index: 0, replace: false}
  }
  else {
    /* check whether to add before/after/on */
    let framenum

    /* 'First' Keyframe (when only one keyframe, this case is used) */
    framenum = array[0].co[0]
    if (IS_EQT(frame, framenum, threshold)) {
      return {index: 0, replace: true}
    }
    else if (frame < framenum)
      return {index: 0, replace: false}

    /* 'Last' Keyframe */
    framenum = array[(arraylen - 1)].co[0]
    if (IS_EQT(frame, framenum, threshold)) {
      return {index: arraylen - 1, replace: true}
    }
    else if (frame > framenum)
      return {index: arraylen, replace: false}
  }


  /* most of the time, this loop is just to find where to put it
   * 'loopbreaker' is just here to prevent infinite loops 
   */
  for (loopbreaker = 0; (start <= end) && (loopbreaker < maxloop); loopbreaker++) {
    /* compute and get midpoint */
    const mid = Math.floor(start + ((end - start) / 2))  /* we calculate the midpoint this way to avoid int overflows... */
    const midfra = array[mid].co[0]

    /* check if exactly equal to midpoint */
    if (IS_EQT(frame, midfra, threshold)) {
      return {index: mid, replace: true}
    }

    /* repeat in upper/lower half */
    if (frame > midfra)
      start = mid + 1
    else if (frame < midfra)
      end = mid - 1
  }

  /* print error if loop-limit exceeded */
  if (loopbreaker == (maxloop - 1)) {
    //console.error("Error: binarysearch_bezt_index() was taking too long\n")

    /* include debug info */
    //console.debug("\tround = %d: start = %d, end = %d, arraylen = %d\n", loopbreaker, start, end, arraylen)
  }

  /* not found, so return where to place it */
  return {index: start, replace: false}
}

/* The total length of the handles is not allowed to be more
 * than the horizontal distance between (v1-v4).
 * This is to prevent curve loops.
 */
function correct_bezpart(v1, v2, v3, v4) {
  let len1, len2, len, fac
  const h1 = []
  const h2 = []

  /* calculate handle deltas */
  h1[0] = v1[0] - v2[0]
  h1[1] = v1[1] - v2[1]

  h2[0] = v4[0] - v3[0]
  h2[1] = v4[1] - v3[1]

  /* calculate distances: 
   *  - len  = span of time between keyframes
   *  - len1  = length of handle of start key
   *  - len2  = length of handle of end key
   */
  len = v4[0] - v1[0]
  len1 = fabsf(h1[0])
  len2 = fabsf(h2[0])

  /* if the handles have no length, no need to do any corrections */
  if ((len1 + len2) == 0.0)
    return

  /* the two handles cross over each other, so force them
   * apart using the proportion they overlap 
   */
  if ((len1 + len2) > len) {
    fac = len / (len1 + len2)

    v2[0] = (v1[0] - fac * h1[0])
    v2[1] = (v1[1] - fac * h1[1])

    v3[0] = (v4[0] - fac * h2[0])
    v3[1] = (v4[1] - fac * h2[1])
  }
}

/* find root ('zero') */
function findzero(x, q0, q1, q2, q3, o) {
  let c0, c1, c2, c3, a, b, c, p, q, d, t, phi
  let nr = 0

  c0 = q0 - x
  c1 = 3.0 * (q1 - q0)
  c2 = 3.0 * (q0 - 2.0 * q1 + q2)
  c3 = q3 - q0 + 3.0 * (q1 - q2)

  if (c3 != 0.0) {
    a = c2 / c3
    b = c1 / c3
    c = c0 / c3
    a = a / 3

    p = b / 3 - a * a
    q = (2 * a * a * a - a * b + c) / 2
    d = q * q + p * p * p

    if (d > 0.0) {
      t = sqrt(d)
      o[0] = (sqrt3d(-q + t) + sqrt3d(-q - t) - a)

      if ((o[0] >= SMALL) && (o[0] <= 1.000001)) return 1
      else return 0
    }
    else if (d == 0.0) {
      t = sqrt3d(-q)
      o[0] = (2 * t - a)

      if ((o[0] >= SMALL) && (o[0] <= 1.000001)) nr++
      o[nr] = (-t - a)

      if ((o[nr] >= SMALL) && (o[nr] <= 1.000001)) return nr + 1
      else return nr
    }
    else {
      phi = acos(-q / sqrt(-(p * p * p)))
      t = sqrt(-p)
      p = cos(phi / 3)
      q = sqrt(3 - 3 * p * p)
      o[0] = (2 * t * p - a)

      if ((o[0] >= SMALL) && (o[0] <= 1.000001)) nr++
      o[nr] = (-t * (p + q) - a)

      if ((o[nr] >= SMALL) && (o[nr] <= 1.000001)) nr++
      o[nr] = (-t * (p - q) - a)

      if ((o[nr] >= SMALL) && (o[nr] <= 1.000001)) return nr + 1
      else return nr
    }
  }
  else {
    a = c2
    b = c1
    c = c0

    if (a != 0.0) {
      /* discriminant */
      p = b * b - 4 * a * c

      if (p > 0) {
        p = sqrt(p)
        o[0] = ((-b - p) / (2 * a))

        if ((o[0] >= SMALL) && (o[0] <= 1.000001)) nr++
        o[nr] = ((-b + p) / (2 * a))

        if ((o[nr] >= SMALL) && (o[nr] <= 1.000001)) return nr + 1
        else return nr
      }
      else if (p == 0) {
        o[0] = (-b / (2 * a))
        if ((o[0] >= SMALL) && (o[0] <= 1.000001)) return 1
        else return 0
      }
    }
    else if (b != 0.0) {
      o[0] = (-c / b)

      if ((o[0] >= SMALL) && (o[0] <= 1.000001)) return 1
      else return 0
    }
    else if (c == 0.0) {
      o[0] = 0.0
      return 1
    }

    return 0
  }
}

function berekeny(f1, f2, f3, f4, o, b) {
  let t, c0, c1, c2, c3, a
  c0 = f1
  c1 = 3.0 * (f2 - f1)
  c2 = 3.0 * (f1 - 2.0 * f2 + f3)
  c3 = f4 - f1 + 3.0 * (f2 - f3)

  for (a = 0; a < b; a++) {
    t = o[a]
    o[a] = c0 + t * c1 + t * t * c2 + t * t * t * c3
  }
}


/* Calculate F-Curve value for 'evaltime' using BezTriple keyframes */
function fcurve_eval_keyframes(fcurve, evaltime) {
  let bezt = 0
  let prevbezt = 0
  let lastbezt = 0
  const eps = 1e-8
  const v1 = []
  const v2 = []
  const v3 = []
  const v4 = []
  const opl = []
  let dx, fac, a, b
  let cvalue = 0
  const {points} = fcurve

  /* get pointers */
  a = points.length - 1
  prevbezt = 0
  bezt = prevbezt + 1
  lastbezt = prevbezt + a

  /* evaluation time at or past endpoints? */
  if (points[prevbezt].co[0] >= evaltime) {
    /* before or on first keyframe */
    if ( (fcurve.extend == FCURVE_EXTRAPOLATE_LINEAR) && (points[prevbezt].interpolation != BEZT_IPO_CONST) &&
         !(fcurve.discreteValues) )
    {
      /* linear or bezier interpolation */
      if (points[prevbezt].interpolation == BEZT_IPO_LIN) {
        /* Use the next center point instead of our own handle for
         * linear interpolated extrapolate 
         */
        if (points.length == 1) {
          cvalue = points[prevbezt].co[1]
        }
        else {
          bezt = prevbezt + 1
          dx = points[prevbezt].co[0] - evaltime
          fac = points[bezt].co[0] - points[prevbezt].co[0]

          /* prevent division by zero */
          if (fac) {
            fac = (points[bezt].co[1] - points[prevbezt].co[1]) / fac
            cvalue = points[prevbezt].co[1] - (fac * dx)
          }
          else {
            cvalue = points[prevbezt].co[1]
          }
        }
      }
      else {
        /* Use the first handle (earlier) of first BezTriple to calculate the
         * gradient and thus the value of the curve at evaltime
         */
        dx = points[prevbezt].co[0] - evaltime
        fac = points[prevbezt].co[0] - points[prevbezt].left[0]
        
        /* prevent division by zero */
        if (fac) {
          fac = (points[prevbezt].co[1] - points[prevbezt].left[1]) / fac
          cvalue = points[prevbezt].co[1] - (fac * dx)
        }
        else {
          cvalue = points[prevbezt].co[1]
        }
      }
    }
    else {
      /* constant (BEZT_IPO_HORIZ) extrapolation or constant interpolation, 
       * so just extend first keyframe's value 
       */
      cvalue = points[prevbezt].co[1]
    }
  }
  else if (points[lastbezt].co[0] <= evaltime) {
    /* after or on last keyframe */
    if ( (fcurve.extend == FCURVE_EXTRAPOLATE_LINEAR) && (points[lastbezt].interpolation != BEZT_IPO_CONST) &&
         !(fcurve.discreteValues) )
    {
      /* linear or bezier interpolation */
      if (points[lastbezt].interpolation == BEZT_IPO_LIN) {
        /* Use the next center point instead of our own handle for
         * linear interpolated extrapolate 
         */
        if (points.length == 1) {
          cvalue = points[lastbezt].co[1]
        }
        else {
          prevbezt = lastbezt - 1
          dx = evaltime - points[lastbezt].co[0]
          fac = points[lastbezt].co[0] - points[prevbezt].co[0]

          /* prevent division by zero */
          if (fac) {
            fac = (points[lastbezt].co[1] - points[prevbezt].co[1]) / fac
            cvalue = points[lastbezt].co[1] + (fac * dx)
          }
          else {
            cvalue = points[lastbezt].co[1]
          }
        }
      }
      else {
        /* Use the gradient of the second handle (later) of last BezTriple to calculate the
         * gradient and thus the value of the curve at evaltime
         */
        dx = evaltime - points[lastbezt].co[0]
        fac = points[lastbezt].right[0] - points[lastbezt].co[0]

        /* prevent division by zero */
        if (fac) {
          fac = (points[lastbezt].right[1] - points[lastbezt].co[1]) / fac
          cvalue = points[lastbezt].co[1] + (fac * dx)
        }
        else {
          cvalue = points[lastbezt].co[1]
        }
      }
    }
    else {
      /* constant (BEZT_IPO_HORIZ) extrapolation or constant interpolation, 
       * so just extend last keyframe's value 
       */
      cvalue = points[lastbezt].co[1]
    }
  }
  else {
    /* evaltime occurs somewhere in the middle of the curve */

    /* Use binary search to find appropriate keyframes...
     * 
     * The threshold here has the following constraints:
     *    - 0.001   is too coarse   -> We get artifacts with 2cm driver movements at 1BU = 1m (see T40332)
     *    - 0.00001 is too fine     -> Weird errors, like selecting the wrong keyframe range (see T39207), occur.
     *                                 This lower bound was established in b888a32eee8147b028464336ad2404d8155c64dd
     */
    let {index: a, replace: exact} = binarysearch_bezt_index_ex(points, evaltime, 0.0001)
    //if (G.debug & G_DEBUG) console.debug("eval fcurve '%s' - %f => %u/%u, %d\n", fcu->rna_path, evaltime, a, fcu->totvert)

    if (exact) {
      /* index returned must be interpreted differently when it sits on top of an existing keyframe 
       * - that keyframe is the start of the segment we need (see action_bug_2.blend in T39207)
       */
      prevbezt = a
      bezt = (a < points.length - 1) ? (prevbezt + 1) : prevbezt
    }
    else {
      /* index returned refers to the keyframe that the eval-time occurs *before*
       * - hence, that keyframe marks the start of the segment we're dealing with
       */
      bezt = a
      prevbezt = (a > 0) ? (bezt - 1) : bezt
    }

    /* use if the key is directly on the frame, rare cases this is needed else we get 0.0 instead. */
    /* XXX: consult T39207 for examples of files where failure of these checks can cause issues */
    if (exact) {
      cvalue = points[prevbezt].co[1]
    }
    else if (fabsf(points[bezt].co[0] - evaltime) < eps) {
      cvalue = points[bezt].co[1]
    }
    /* evaltime occurs within the interval defined by these two keyframes */
    else if ((points[prevbezt].co[0] <= evaltime) && (points[bezt].co[0] >= evaltime)) {
      const begin = points[prevbezt].co[1]
      const change = points[bezt].co[1] - points[prevbezt].co[1]
      const duration = points[bezt].co[0] - points[prevbezt].co[0]
      const time = evaltime - points[prevbezt].co[0]
      // used in elastic interpolation mode (unimplemented)
      //const amplitude = points[prevbezt].amplitude
      //const period = points[prevbezt].period

      /* value depends on interpolation mode */
      if ((points[prevbezt].interpolation == BEZT_IPO_CONST) || (fcurve.discreteValues) || (duration == 0)) {
        /* constant (evaltime not relevant, so no interpolation needed) */
        cvalue = points[prevbezt].co[1]
      }
      else {
        switch (points[prevbezt].interpolation) {
          /* interpolation ...................................... */
          case BEZT_IPO_BEZ:
            /* bezier interpolation */
            /* (v1, v2) are the first keyframe and its 2nd handle */
            v1[0] = points[prevbezt].co[0]
            v1[1] = points[prevbezt].co[1]
            v2[0] = points[prevbezt].right[0]
            v2[1] = points[prevbezt].right[1]
            /* (v3, v4) are the last keyframe's 1st handle + the last keyframe */
            v3[0] = points[bezt].left[0]
            v3[1] = points[bezt].left[1]
            v4[0] = points[bezt].co[0]
            v4[1] = points[bezt].co[1]

            if (fabsf(v1[1] - v4[1]) < FLT_EPSILON &&
                fabsf(v2[1] - v3[1]) < FLT_EPSILON &&
                fabsf(v3[1] - v4[1]) < FLT_EPSILON)
            {
              /* Optimisation: If all the handles are flat/at the same values,
               * the value is simply the shared value (see T40372 -> F91346)
               */
              cvalue = v1[1]
            }
            else {
              /* adjust handles so that they don't overlap (forming a loop) */
              correct_bezpart(v1, v2, v3, v4)

              /* try to get a value for this position - if failure, try another set of points */
              b = findzero(evaltime, v1[0], v2[0], v3[0], v4[0], opl)
              if (b) {
                berekeny(v1[1], v2[1], v3[1], v4[1], opl, 1)
                cvalue = opl[0]
                /* break */
              }
              //else {
              //  if (G.debug & G_DEBUG) console.debug("    ERROR: findzero() failed at %f with %f %f %f %f\n", evaltime, v1[0], v2[0], v3[0], v4[0])
              //}
            }
            break

//          case BEZT_IPO_LIN:
//            /* linear - simply linearly interpolate between values of the two keyframes */
//            cvalue = BLI_easing_linear_ease(time, begin, change, duration)
//            break
//
//          /* easing ............................................ */
//          case BEZT_IPO_BACK:
//            switch (prevbezt->easing) {
//              case BEZT_IPO_EASE_IN:
//                cvalue = BLI_easing_back_ease_in(time, begin, change, duration, prevbezt->back)
//                break
//              case BEZT_IPO_EASE_OUT:
//                cvalue = BLI_easing_back_ease_out(time, begin, change, duration, prevbezt->back)
//                break
//              case BEZT_IPO_EASE_IN_OUT:
//                cvalue = BLI_easing_back_ease_in_out(time, begin, change, duration, prevbezt->back)
//                break
//
//              default: /* default/auto: same as ease out */
//                cvalue = BLI_easing_back_ease_out(time, begin, change, duration, prevbezt->back)
//                break
//            }
//            break
//
//          case BEZT_IPO_BOUNCE:
//            switch (prevbezt->easing) {
//              case BEZT_IPO_EASE_IN:
//                cvalue = BLI_easing_bounce_ease_in(time, begin, change, duration)
//                break
//              case BEZT_IPO_EASE_OUT:
//                cvalue = BLI_easing_bounce_ease_out(time, begin, change, duration)
//                break
//              case BEZT_IPO_EASE_IN_OUT:
//                cvalue = BLI_easing_bounce_ease_in_out(time, begin, change, duration)
//                break
//
//              default: /* default/auto: same as ease out */
//                cvalue = BLI_easing_bounce_ease_out(time, begin, change, duration)
//                break
//            }
//            break
//
//          case BEZT_IPO_CIRC:
//            switch (prevbezt->easing) {
//              case BEZT_IPO_EASE_IN:
//                cvalue = BLI_easing_circ_ease_in(time, begin, change, duration)
//                break
//              case BEZT_IPO_EASE_OUT:
//                cvalue = BLI_easing_circ_ease_out(time, begin, change, duration)
//                break
//              case BEZT_IPO_EASE_IN_OUT:
//                cvalue = BLI_easing_circ_ease_in_out(time, begin, change, duration)
//                break
//
//              default: /* default/auto: same as ease in */
//                cvalue = BLI_easing_circ_ease_in(time, begin, change, duration)
//                break
//            }
//            break
//
//          case BEZT_IPO_CUBIC:
//            switch (prevbezt->easing) {
//              case BEZT_IPO_EASE_IN:
//                cvalue = BLI_easing_cubic_ease_in(time, begin, change, duration)
//                break
//              case BEZT_IPO_EASE_OUT:
//                cvalue = BLI_easing_cubic_ease_out(time, begin, change, duration)
//                break
//              case BEZT_IPO_EASE_IN_OUT:
//                cvalue = BLI_easing_cubic_ease_in_out(time, begin, change, duration)
//                break
//
//              default: /* default/auto: same as ease in */
//                cvalue = BLI_easing_cubic_ease_in(time, begin, change, duration)
//                break
//            }
//            break
//
//          case BEZT_IPO_ELASTIC:
//            switch (prevbezt->easing) {
//              case BEZT_IPO_EASE_IN:
//                cvalue = BLI_easing_elastic_ease_in(time, begin, change, duration, amplitude, period)
//                break
//              case BEZT_IPO_EASE_OUT:
//                cvalue = BLI_easing_elastic_ease_out(time, begin, change, duration, amplitude, period)
//                break
//              case BEZT_IPO_EASE_IN_OUT:
//                cvalue = BLI_easing_elastic_ease_in_out(time, begin, change, duration, amplitude, period)
//                break
//
//              default: /* default/auto: same as ease out */
//                cvalue = BLI_easing_elastic_ease_out(time, begin, change, duration, amplitude, period)
//                break
//            }
//            break
//
//          case BEZT_IPO_EXPO:
//            switch (prevbezt->easing) {
//              case BEZT_IPO_EASE_IN:
//                cvalue = BLI_easing_expo_ease_in(time, begin, change, duration)
//                break
//              case BEZT_IPO_EASE_OUT:
//                cvalue = BLI_easing_expo_ease_out(time, begin, change, duration)
//                break
//              case BEZT_IPO_EASE_IN_OUT:
//                cvalue = BLI_easing_expo_ease_in_out(time, begin, change, duration)
//                break
//
//              default: /* default/auto: same as ease in */
//                cvalue = BLI_easing_expo_ease_in(time, begin, change, duration)
//                break
//            }
//            break
//
//          case BEZT_IPO_QUAD:
//            switch (prevbezt->easing) {
//              case BEZT_IPO_EASE_IN:
//                cvalue = BLI_easing_quad_ease_in(time, begin, change, duration)
//                break
//              case BEZT_IPO_EASE_OUT:
//                cvalue = BLI_easing_quad_ease_out(time, begin, change, duration)
//                break
//              case BEZT_IPO_EASE_IN_OUT:
//                cvalue = BLI_easing_quad_ease_in_out(time, begin, change, duration)
//                break
//
//              default: /* default/auto: same as ease in */
//                cvalue = BLI_easing_quad_ease_in(time, begin, change, duration)
//                break
//            }
//            break
//
//          case BEZT_IPO_QUART:
//            switch (prevbezt->easing) {
//              case BEZT_IPO_EASE_IN:
//                cvalue = BLI_easing_quart_ease_in(time, begin, change, duration)
//                break
//              case BEZT_IPO_EASE_OUT:
//                cvalue = BLI_easing_quart_ease_out(time, begin, change, duration)
//                break
//              case BEZT_IPO_EASE_IN_OUT:
//                cvalue = BLI_easing_quart_ease_in_out(time, begin, change, duration)
//                break
//
//              default: /* default/auto: same as ease in */
//                cvalue = BLI_easing_quart_ease_in(time, begin, change, duration)
//                break
//            }
//            break
//
//          case BEZT_IPO_QUINT:
//            switch (prevbezt->easing) {
//              case BEZT_IPO_EASE_IN:
//                cvalue = BLI_easing_quint_ease_in(time, begin, change, duration)
//                break
//              case BEZT_IPO_EASE_OUT:
//                cvalue = BLI_easing_quint_ease_out(time, begin, change, duration)
//                break
//              case BEZT_IPO_EASE_IN_OUT:
//                cvalue = BLI_easing_quint_ease_in_out(time, begin, change, duration)
//                break
//
//              default: /* default/auto: same as ease in */
//                cvalue = BLI_easing_quint_ease_in(time, begin, change, duration)
//                break
//            }
//            break
//
//          case BEZT_IPO_SINE:
//            switch (prevbezt->easing) {
//              case BEZT_IPO_EASE_IN:
//                cvalue = BLI_easing_sine_ease_in(time, begin, change, duration)
//                break
//              case BEZT_IPO_EASE_OUT:
//                cvalue = BLI_easing_sine_ease_out(time, begin, change, duration)
//                break
//              case BEZT_IPO_EASE_IN_OUT:
//                cvalue = BLI_easing_sine_ease_in_out(time, begin, change, duration)
//                break
//
//              default: /* default/auto: same as ease in */
//                cvalue = BLI_easing_sine_ease_in(time, begin, change, duration)
//                break
//            }
//            break


          default:
            cvalue = points[prevbezt].co[1]
            break
        }
      }
    }
    //else {
    //  if (G.debug & G_DEBUG) console.debug("   ERROR: failed eval - p=%f b=%f, t=%f (%f)\n", points[prevbezt].co[0], points[bezt].co[0], evaltime, fabsf(points[bezt].co[0] - evaltime))
    //}
  }

  /* return value */
  return cvalue
}

module.exports = {
  evaluateFCurve: fcurve_eval_keyframes,
}
