
export default {
  store: {
    selection: null,
    data: {
      "type": "Module",
      "body": [
        {
            "type": "BinOp",
            "left": {
              "type": "Name",
              "id": "a",
              "ctx": {
                "type": "Load"
              }
            },
            "op": {
              "type": "Add"
            },
            "right": {
              "type": "Name",
              "id": "b",
              "ctx": {
                "type": "Load"
              }
            }

        },
        {
            "type": "BinOp",
            "left": {
              "type": "BinOp",
              "left": {
                "type": "Num",
                "n": "1"
              },
              "op": {
                "type": "FloorDiv"
              },
              "right": {
                "type": "Num",
                "n": "2"
              }
            },
            "op": {
              "type": "Sub"
            },
            "right": {
              "type": "BinOp",
              "left": {
                "type": "Num",
                "n": "3"
              },
              "op": {
                "type": "Add"
              },
              "right": {
                "type": "Num",
                "n": "4"
              }
            }
          }
      ]
    }









  }
}
