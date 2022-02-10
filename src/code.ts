const postSelectionType = (selection) => {
  switch (true) {

    // Single frame selected
    case (selection.length === 1 && selection[0].type === "FRAME"):
      const node = selection[0]
      figma.ui.postMessage({
        type: "single-selection",
        value: {
          name: node.name,
          styles: {
            fills: node.fills,
            strokes: node.strokes,
            topLeftRadius: node.topLeftRadius,
            topRightRadius: node.topRightRadius,
            bottomLeftRadius: node.bottomLeftRadius,
            bottomRightRadius: node.bottomRightRadius,
            effects: node.effects,
            blendMode: node.blendMode,
          }
        }
      })
      break

    // Multiple frames selected
    case (selection.length > 1 && !selection.some(item => item.type !== "FRAME")):
      figma.ui.postMessage({
        type: "multi-selection",
      })
      break

    case(selection.length === 0):
      figma.ui.postMessage({
        type: "empty-selection",
      })
      break

    // Anything else is invalid
    default:
      figma.ui.postMessage({
        type: "invalid-selection",
      })
  }
}

figma.showUI(__html__, {
  width: 500,
  height: 800
});

// figma.root.setPluginData("styles", "")

let data:any[] = []
const rawData = figma.root.getPluginData("styles")

if (rawData !== "") {
  data = JSON.parse(rawData)
}

postSelectionType(figma.currentPage.selection)

figma.on("selectionchange", () => postSelectionType(figma.currentPage.selection))

figma.ui.onmessage = msg => {
  if (msg.type === "create-style") {
    const selection = figma.currentPage.selection

    if (selection.length === 1 && selection[0].type === "FRAME") {
      const item = {
        name: selection[0].name,
        id: msg.id,
        styles: {
          fills: selection[0].fills,
          strokes: selection[0].strokes,
          topLeftRadius: selection[0].topLeftRadius,
          topRightRadius: selection[0].topRightRadius,
          bottomLeftRadius: selection[0].bottomLeftRadius,
          bottomRightRadius: selection[0].bottomRightRadius,
          effects: selection[0].effects,
          blendMode: selection[0].blendMode,
        }
      }

      data.push(item)
      figma.root.setPluginData("styles", JSON.stringify(data))

      figma.ui.postMessage({
        type: "added-style",
        value: item
      })
    } else if (selection.length === 0) {
      alert("Please select a frame")
    } else {
      alert("Please select only one frame")
    }
  }

  if (msg.type === "delete-style") {
    data = data.filter(item => item.id !== msg.id)
    figma.root.setPluginData("styles", JSON.stringify(data))

    figma.ui.postMessage({
      type: "deleted-style",
      value: data,
    })
  }

  if (msg.type === "reorder-styles") {
    data = msg.items
    figma.root.setPluginData("styles", JSON.stringify(data))
  }

  //figma.closePlugin();
};
