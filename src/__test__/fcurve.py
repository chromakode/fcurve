import sys
import json

import bpy


input_data = json.loads(sys.argv[-1])
input_points = input_data['fcurve']['points']

bpy.ops.mesh.primitive_cube_add()
cube = bpy.context.object
cube.keyframe_insert(data_path="location", frame=1)
fcurve = cube.animation_data.action.fcurves[0]
fcurve.keyframe_points.remove(fcurve.keyframe_points[0])

for input_point in input_points:
    fcurve.keyframe_points.add()
    point = fcurve.keyframe_points[-1]

    point.interpolation = input_point['interpolation']
    point.co.x = input_point['co'][0]
    point.co.y = input_point['co'][1]
    point.handle_left.x = input_point['left'][0]
    point.handle_left.y = input_point['left'][1]
    point.handle_right.x = input_point['right'][0]
    point.handle_right.y = input_point['right'][1]

fcurve.convert_to_samples(input_data['start'], input_data['end'])

sampled_points = [list(p.co) for p in fcurve.sampled_points]
json.dump(sampled_points, sys.stdout)
