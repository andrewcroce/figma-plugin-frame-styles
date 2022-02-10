import { v4 as uid } from "uuid";
figma.showUI(__html__);
// figma.root.setPluginData("styles", "")
let data = [];
const rawData = figma.root.getPluginData("styles");
if (rawData !== "") {
    data = JSON.parse(rawData);
}
figma.ui.postMessage({
    type: "initialize",
    value: data,
});
figma.ui.onmessage = msg => {
    if (msg.type === "create-style") {
        const item = {
            name: "Item",
            id: uid()
        };
        data.push(item);
        figma.root.setPluginData("styles", JSON.stringify(data));
        figma.ui.postMessage({
            type: "add-style",
            value: item,
        });
    }
    //figma.closePlugin();
};
