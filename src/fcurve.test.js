const rewire = require("rewire")
const fcurve = rewire("./fcurve")
const IS_EQT = fcurve.__get__("IS_EQT")
const sqrt3d = fcurve.__get__("sqrt3d")
const binarysearch_bezt_index_ex = fcurve.__get__("binarysearch_bezt_index_ex")
const correct_bezpart = fcurve.__get__("correct_bezpart")
const findzero = fcurve.__get__("findzero")
const berekeny = fcurve.__get__("berekeny")
// @ponicode
describe("IS_EQT", () => {
    test("0", () => {
        let callFunction = () => {
            IS_EQT(10, -1, "rgb(0,100,200)")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction = () => {
            IS_EQT(-100, 0.0, 0.0)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction = () => {
            IS_EQT(-1, -1, "black")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction = () => {
            IS_EQT(-1, -1, 0)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction = () => {
            IS_EQT(0, 1, -1)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction = () => {
            IS_EQT(undefined, undefined, undefined)
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("sqrt3d", () => {
    test("0", () => {
        let callFunction = () => {
            sqrt3d(0)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction = () => {
            sqrt3d(90)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction = () => {
            sqrt3d(550)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction = () => {
            sqrt3d(0.0)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction = () => {
            sqrt3d(380)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction = () => {
            sqrt3d(undefined)
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("binarysearch_bezt_index_ex", () => {
    test("0", () => {
        let object = [["foo bar", -0.353, "**text**", 4653], ["a", "b", "043", "foo bar"], [10, -45.9, 103.5, 0.955674]]
        let object2 = [["a", "b", "043", "foo bar"], ["a", "b", "043", "foo bar"], ["a", "b", "043", "foo bar"]]
        let object3 = [[-1, 0.5, 1, 2, 3, 4, 5], ["a", "b", "043", "foo bar"], ["foo bar", -0.353, "**text**", 4653]]
        let object4 = [object, object2, object3]
        let object5 = [["foo bar", -0.353, "**text**", 4653], [10, -45.9, 103.5, 0.955674], ["a", "b", "043", "foo bar"]]
        let object6 = [["a", "b", "043", "foo bar"], [-1, 0.5, 1, 2, 3, 4, 5], ["a", "b", "043", "foo bar"]]
        let object7 = [[10, -45.9, 103.5, 0.955674], ["a", "b", "043", "holasenior"], ["a", "b", "043", "foo bar"]]
        let object8 = [object5, object6, object7]
        let object9 = [[10, -45.9, 103.5, 0.955674], ["foo bar", -0.353, "**text**", 4653], [-1, 0.5, 1, 2, 3, 4, 5]]
        let object10 = [["foo bar", -0.353, "**text**", 4653], ["a", "b", "043", "foo bar"], [10, -45.9, 103.5, 0.955674]]
        let object11 = [[10, -45.9, 103.5, 0.955674], ["foo bar", -0.353, "**text**", 4653], ["a", "b", "043", "foo bar"]]
        let object12 = [object9, object10, object11]
        let param1 = [object4, object8, object12]
        let callFunction = () => {
            binarysearch_bezt_index_ex(param1, ["Edmond", "George", "Michael"], 6370000)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let object = [["a", "b", "043", "foo bar"], [-1, 0.5, 1, 2, 3, 4, 5], [10, -45.9, 103.5, 0.955674]]
        let object2 = [["foo bar", -0.353, "**text**", 4653], ["foo bar", -0.353, "**text**", 4653], [-1, 0.5, 1, 2, 3, 4, 5]]
        let object3 = [[10, -45.9, 103.5, 0.955674], ["a", "b", "043", "foo bar"], [-1, 0.5, 1, 2, 3, 4, 5]]
        let object4 = [object, object2, object3]
        let object5 = [["foo bar", -0.353, "**text**", 4653], [10, -45.9, 103.5, 0.955674], ["a", "b", "043", "foo bar"]]
        let object6 = [["foo bar", -0.353, "**text**", 4653], [10, -45.9, 103.5, 0.955674], ["foo bar", -0.353, "**text**", 4653]]
        let object7 = [["a", "b", "043", "holasenior"], ["a", "b", "043", "foo bar"], ["a", "b", "043", "holasenior"]]
        let object8 = [object5, object6, object7]
        let object9 = [["foo bar", -0.353, "**text**", 4653], ["a", "b", "043", "foo bar"], [10, -45.9, 103.5, 0.955674]]
        let object10 = [[-1, 0.5, 1, 2, 3, 4, 5], ["a", "b", "043", "foo bar"], ["a", "b", "043", "foo bar"]]
        let object11 = [["a", "b", "043", "foo bar"], ["a", "b", "043", "foo bar"], [10, -45.9, 103.5, 0.955674]]
        let object12 = [object9, object10, object11]
        let param1 = [object4, object8, object12]
        let callFunction = () => {
            binarysearch_bezt_index_ex(param1, ["Jean-Philippe", "George", "Jean-Philippe"], 9999)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let object = [["a", "b", "043", "foo bar"], [10, -45.9, 103.5, 0.955674], [10, -45.9, 103.5, 0.955674]]
        let object2 = [[-1, 0.5, 1, 2, 3, 4, 5], [-1, 0.5, 1, 2, 3, 4, 5], ["a", "b", "043", "foo bar"]]
        let object3 = [[-1, 0.5, 1, 2, 3, 4, 5], [-1, 0.5, 1, 2, 3, 4, 5], ["foo bar", -0.353, "**text**", 4653]]
        let object4 = [object, object2, object3]
        let object5 = [["foo bar", -0.353, "**text**", 4653], [10, -45.9, 103.5, 0.955674], [-1, 0.5, 1, 2, 3, 4, 5]]
        let object6 = [[10, -45.9, 103.5, 0.955674], ["foo bar", -0.353, "**text**", 4653], ["foo bar", -0.353, "**text**", 4653]]
        let object7 = [["foo bar", -0.353, "**text**", 4653], [10, -45.9, 103.5, 0.955674], ["foo bar", -0.353, "**text**", 4653]]
        let object8 = [object5, object6, object7]
        let object9 = [["foo bar", -0.353, "**text**", 4653], ["a", "b", "043", "foo bar"], ["a", "b", "043", "foo bar"]]
        let object10 = [[10, -45.9, 103.5, 0.955674], ["a", "b", "043", "holasenior"], ["a", "b", "043", "foo bar"]]
        let object11 = [["a", "b", "043", "foo bar"], [10, -45.9, 103.5, 0.955674], ["foo bar", -0.353, "**text**", 4653]]
        let object12 = [object9, object10, object11]
        let param1 = [object4, object8, object12]
        let callFunction = () => {
            binarysearch_bezt_index_ex(param1, ["Michael", "Pierre Edouard", "George"], 0)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let object = [[-1, 0.5, 1, 2, 3, 4, 5], ["a", "b", "043", "foo bar"], [10, -45.9, 103.5, 0.955674]]
        let object2 = [["a", "b", "043", "foo bar"], ["foo bar", -0.353, "**text**", 4653], ["foo bar", -0.353, "**text**", 4653]]
        let object3 = [[10, -45.9, 103.5, 0.955674], ["foo bar", -0.353, "**text**", 4653], [10, -45.9, 103.5, 0.955674]]
        let object4 = [object, object2, object3]
        let object5 = [["foo bar", -0.353, "**text**", 4653], ["a", "b", "043", "holasenior"], ["foo bar", -0.353, "**text**", 4653]]
        let object6 = [["foo bar", -0.353, "**text**", 4653], ["a", "b", "043", "holasenior"], ["foo bar", -0.353, "**text**", 4653]]
        let object7 = [["foo bar", -0.353, "**text**", 4653], ["foo bar", -0.353, "**text**", 4653], ["a", "b", "043", "holasenior"]]
        let object8 = [object5, object6, object7]
        let object9 = [["a", "b", "043", "holasenior"], ["a", "b", "043", "foo bar"], ["a", "b", "043", "foo bar"]]
        let object10 = [["a", "b", "043", "foo bar"], ["foo bar", -0.353, "**text**", 4653], ["a", "b", "043", "holasenior"]]
        let object11 = [["a", "b", "043", "foo bar"], ["foo bar", -0.353, "**text**", 4653], ["a", "b", "043", "foo bar"]]
        let object12 = [object9, object10, object11]
        let param1 = [object4, object8, object12]
        let callFunction = () => {
            binarysearch_bezt_index_ex(param1, ["Jean-Philippe", "George", "Pierre Edouard"], 100.0)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let object = [["a", "b", "043", "holasenior"], ["a", "b", "043", "foo bar"], [10, -45.9, 103.5, 0.955674]]
        let object2 = [[10, -45.9, 103.5, 0.955674], [-1, 0.5, 1, 2, 3, 4, 5], ["a", "b", "043", "foo bar"]]
        let object3 = [["a", "b", "043", "foo bar"], [-1, 0.5, 1, 2, 3, 4, 5], ["foo bar", -0.353, "**text**", 4653]]
        let object4 = [object, object2, object3]
        let object5 = [["a", "b", "043", "holasenior"], ["a", "b", "043", "holasenior"], ["foo bar", -0.353, "**text**", 4653]]
        let object6 = [["a", "b", "043", "foo bar"], ["foo bar", -0.353, "**text**", 4653], ["a", "b", "043", "foo bar"]]
        let object7 = [["a", "b", "043", "foo bar"], ["a", "b", "043", "foo bar"], ["foo bar", -0.353, "**text**", 4653]]
        let object8 = [object5, object6, object7]
        let object9 = [["foo bar", -0.353, "**text**", 4653], ["a", "b", "043", "foo bar"], ["foo bar", -0.353, "**text**", 4653]]
        let object10 = [["foo bar", -0.353, "**text**", 4653], [10, -45.9, 103.5, 0.955674], [-1, 0.5, 1, 2, 3, 4, 5]]
        let object11 = [["foo bar", -0.353, "**text**", 4653], ["a", "b", "043", "foo bar"], ["foo bar", -0.353, "**text**", 4653]]
        let object12 = [object9, object10, object11]
        let param1 = [object4, object8, object12]
        let callFunction = () => {
            binarysearch_bezt_index_ex(param1, ["George", "Edmond", "Edmond"], 0.01)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction = () => {
            binarysearch_bezt_index_ex(undefined, [], NaN)
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("correct_bezpart", () => {
    test("0", () => {
        let callFunction = () => {
            correct_bezpart([-1, 0, -10], [-100, -10, -10], [0, 0.0, 1], [0.0, 0, 10])
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction = () => {
            correct_bezpart([1, 10, 0], [-10, 10, 10], [10, 0.0, 1], [-1, -10, -10])
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction = () => {
            correct_bezpart([550, -10, 0.0], [-1, -10, 10], [-10, 100, -10], [0, 1, 0])
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction = () => {
            correct_bezpart([0.0, 1, 0.0], [-10, 10, -10], [0.0, -10, 0], [0, -1, 1])
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction = () => {
            correct_bezpart([10, 400, 100], [1, -5.48, 0], [-1, 1, 10], [-10, 0.0, 0])
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction = () => {
            correct_bezpart(undefined, undefined, [], undefined)
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("findzero", () => {
    test("0", () => {
        let callFunction = () => {
            findzero(100, 0, 1, 0, 0.0, [100, 1, 1])
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction = () => {
            findzero(70, -10, 90, -1, 100, [100, 0, 1])
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction = () => {
            findzero(350, 0.0, 70, 0.0, 0.0, [-100, 100, 100])
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction = () => {
            findzero(50, 1, 50, -1, 100, [1, 100, -5.48])
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction = () => {
            findzero(10, -1, 400, 10, 1, [-100, 100, 0])
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction = () => {
            findzero(Infinity, Infinity, Infinity, undefined, Infinity, [])
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("berekeny", () => {
    test("0", () => {
        let callFunction = () => {
            berekeny(1, 10, 0, 1, [-10, 10, -10], -5.48)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction = () => {
            berekeny(1, 0.0, 1, 100, [0, 0.0, 0.0], 1)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction = () => {
            berekeny(-10, -100, 10, 0, [0.0, 0, 10], 0)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction = () => {
            berekeny(10, 0, 10, 0, [1, 0, 0.0], 100)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction = () => {
            berekeny(1, -10, 0, -1, [-1, 0.0, 1], 100)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction = () => {
            berekeny(undefined, undefined, -Infinity, undefined, undefined, -Infinity)
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("fcurve.evaluateFCurve", () => {
    test("0", () => {
        let object = [{ co: [10, 10], interpolation: "BEZT_IPO_BEZ", right: [0, "18.12.93.94"], left: "244.9.255.240" }, { co: [0.0, 1], interpolation: "BEZT_IPO_BEZ", right: [-1, 0], left: "201.100.244.168" }, { co: [0.0, 10], interpolation: "BEZT_IPO_BEZ", right: [0.0, -10], left: "240.159.249.190" }, { co: [0.0, 0.0], interpolation: "BEZT_IPO_BEZ", right: [0, "240.159.249.190"], left: "240.159.249.190" }, { co: [10, -1], interpolation: "BEZT_IPO_BEZ", right: [0.0, "139.3.227.118"], left: "18.12.93.94" }, { co: [10, -1], interpolation: "BEZT_IPO_BEZ", right: [-1, 1], left: "139.3.227.118" }, { co: [0, 10], interpolation: "BEZT_IPO_BEZ", right: [0.0, 10], left: "139.3.227.118" }, { co: [0, -10], interpolation: "BEZT_IPO_BEZ", right: [-1, 0], left: "244.9.255.240" }]
        let callFunction = () => {
            fcurve.evaluateFCurve({ discreteValues: [-1, 0.5, 1, 2, 3, 4, 5], points: object, extend: "Pierre Edouard" }, -10)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let object = [{ co: "Saltwater Crocodile", interpolation: "BEZT_IPO_BEZ", right: [-10, 10], left: [0, 10] }, { co: "Nile Crocodile", interpolation: "BEZT_IPO_BEZ", right: [-1, 10], left: ["201.100.244.168", -10] }, { co: "Saltwater Crocodile", interpolation: "BEZT_IPO_BEZ", right: [-1, -10], left: [-10, 0.0] }, { co: "Saltwater Crocodile", interpolation: "BEZT_IPO_BEZ", right: [0, -10], left: ["139.3.227.118", -10] }, { co: "Dwarf Crocodile", interpolation: "BEZT_IPO_BEZ", right: [-1, -10], left: ["139.3.227.118", 0.0] }, { co: "Nile Crocodile", interpolation: "BEZT_IPO_BEZ", right: ["201.100.244.168", -1], left: [0, 1] }, { co: "Nile Crocodile", interpolation: "BEZT_IPO_BEZ", right: [10, 0], left: ["139.3.227.118", 0] }, { co: "Spectacled Caiman", interpolation: "BEZT_IPO_BEZ", right: ["18.12.93.94", -10], left: [1, -1] }]
        let callFunction = () => {
            fcurve.evaluateFCurve({ discreteValues: [-1, 0.5, 1, 2, 3, 4, 5], points: object, extend: "Michael" }, 1)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let object = [{ co: "Australian Freshwater Crocodile", interpolation: "BEZT_IPO_BEZ", right: [-1, 0], left: ["139.3.227.118", 0.0] }, { co: "Dwarf Crocodile", interpolation: "BEZT_IPO_BEZ", right: [-1, -1], left: [-10, 0] }, { co: "Saltwater Crocodile", interpolation: "BEZT_IPO_BEZ", right: [-1, 0.0], left: [1, 10] }, { co: "Nile Crocodile", interpolation: "BEZT_IPO_BEZ", right: [10, 1], left: [-10, 10] }, { co: "Australian Freshwater Crocodile", interpolation: "BEZT_IPO_BEZ", right: ["244.9.255.240", 10], left: [0.0, -10] }, { co: "Saltwater Crocodile", interpolation: "BEZT_IPO_BEZ", right: [-1, 10], left: [-10, 0.0] }, { co: "Australian Freshwater Crocodile", interpolation: "BEZT_IPO_BEZ", right: ["244.9.255.240", 1], left: [-10, "139.3.227.118"] }, { co: "Australian Freshwater Crocodile", interpolation: "BEZT_IPO_BEZ", right: ["244.9.255.240", -10], left: [1, 10] }]
        let callFunction = () => {
            fcurve.evaluateFCurve({ discreteValues: [-1, 0.5, 1, 2, 3, 4, 5], points: object, extend: "Pierre Edouard" }, 0)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let object = [{ co: "Spectacled Caiman", interpolation: "BEZT_IPO_BEZ", right: [1, 0.0], left: [-10, 10] }, { co: "Saltwater Crocodile", interpolation: "BEZT_IPO_BEZ", right: [1, "139.3.227.118"], left: ["244.9.255.240", 0] }, { co: "Spectacled Caiman", interpolation: "BEZT_IPO_BEZ", right: [-10, -10], left: [10, 0.0] }, { co: "Australian Freshwater Crocodile", interpolation: "BEZT_IPO_BEZ", right: [1, 10], left: [-1, -1] }, { co: "Spectacled Caiman", interpolation: "BEZT_IPO_BEZ", right: [0.0, -1], left: ["139.3.227.118", -10] }, { co: "Spectacled Caiman", interpolation: "BEZT_IPO_BEZ", right: [0, 0], left: [0.0, 10] }, { co: "Spectacled Caiman", interpolation: "BEZT_IPO_BEZ", right: [0, 0.0], left: [0, 1] }, { co: "Spectacled Caiman", interpolation: "BEZT_IPO_BEZ", right: [0.0, 0.0], left: [0.0, 1] }]
        let callFunction = () => {
            fcurve.evaluateFCurve({ discreteValues: [-1, 0.5, 1, 2, 3, 4, 5], points: object, extend: "Michael" }, -1)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let object = [{ co: [-1, -10], interpolation: "BEZT_IPO_BEZ", right: [0.0, "201.100.244.168"], left: "244.9.255.240" }, { co: [0.0, 0], interpolation: "BEZT_IPO_BEZ", right: [0, -10], left: "244.9.255.240" }, { co: [-1, -1], interpolation: "BEZT_IPO_BEZ", right: [0.0, 1], left: "240.159.249.190" }, { co: [0.0, -10], interpolation: "BEZT_IPO_BEZ", right: [1, 10], left: "240.159.249.190" }, { co: [-1, 1], interpolation: "BEZT_IPO_BEZ", right: [0.0, "139.3.227.118"], left: "18.12.93.94" }, { co: [-10, 0], interpolation: "BEZT_IPO_BEZ", right: [-1, -1], left: "201.100.244.168" }, { co: [-1, 0], interpolation: "BEZT_IPO_BEZ", right: [-10, 10], left: "244.9.255.240" }, { co: [-1, 1], interpolation: "BEZT_IPO_BEZ", right: [-1, 0.0], left: "244.9.255.240" }]
        let callFunction = () => {
            fcurve.evaluateFCurve({ discreteValues: ["foo bar", -0.353, "**text**", 4653], points: object, extend: "Pierre Edouard" }, 0)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction = () => {
            fcurve.evaluateFCurve(undefined, -Infinity)
        }
    
        expect(callFunction).not.toThrow()
    })
})
