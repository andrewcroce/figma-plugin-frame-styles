import { styleKeys } from "./styleKeys"

const postSelectionType = (selection) => {
  switch (true) {

    // Single frame selected
    case (selection.length === 1 && selection[0].type === "FRAME"):
      const node = selection[0]
      figma.ui.postMessage({
        type: "single-selection",
        value: {
          name: node.name,
          styles: Object.assign(styleKeys.map(key => ({ [key]: node[key] })))
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

// console.log("RAW DATA", rawData)

if (rawData !== "") {
  data = JSON.parse(rawData)
  // console.log("PARSED DATA", data)
}

postSelectionType(figma.currentPage.selection)

figma.ui.postMessage({
  type: "initialize",
  value: data
})

figma.on("selectionchange", () => postSelectionType(figma.currentPage.selection))

figma.ui.onmessage = msg => {
  if (msg.type === "create-style") {
    const selection = figma.currentPage.selection

    if (selection.length === 1 && selection[0].type === "FRAME") {
      const item = {
        name: selection[0].name,
        id: msg.id,
        styles: styleKeys.reduce((obj, key) => (
          Object.assign(obj, {
            [key]: selection[0][key]
          })
        ), {})
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

  if (msg.type === "apply-style") {
    const selections = figma.currentPage.selection
    const s = data.find((style) => style.id === msg.id)

    selections.forEach((selection) => {
      if (selection.type !== "FRAME") {
        throw new Error("Styles can only be applied to frames")
      } else {
        styleKeys.forEach((key) => { selection[key] = s.styles[key] })
        selection.setPluginData("styleId", s.id)
      }
    })
  }

  if (msg.type === "rename-style") {
    const i = data.findIndex((style) => style.id === msg.id)
    data[i].name = msg.name
    figma.root.setPluginData("styles", JSON.stringify(data))

    figma.ui.postMessage({
      type: "renamed-style",
      value: data,
    })
  }

  if (msg.type === "reorder-styles") {
    data = msg.items
    figma.root.setPluginData("styles", JSON.stringify(data))
  }

  //figma.closePlugin();
};
