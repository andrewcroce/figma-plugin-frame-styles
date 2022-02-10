/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!*********************!*\
  !*** ./src/code.ts ***!
  \*********************/
const postSelectionType = (selection) => {
    switch (true) {
        // Single frame selected
        case (selection.length === 1 && selection[0].type === "FRAME"):
            const node = selection[0];
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
            });
            break;
        // Multiple frames selected
        case (selection.length > 1 && !selection.some(item => item.type !== "FRAME")):
            figma.ui.postMessage({
                type: "multi-selection",
            });
            break;
        case (selection.length === 0):
            figma.ui.postMessage({
                type: "empty-selection",
            });
            break;
        // Anything else is invalid
        default:
            figma.ui.postMessage({
                type: "invalid-selection",
            });
    }
};
figma.showUI(__html__, {
    width: 500,
    height: 800
});
// figma.root.setPluginData("styles", "")
let data = [];
const rawData = figma.root.getPluginData("styles");
if (rawData !== "") {
    data = JSON.parse(rawData);
}
postSelectionType(figma.currentPage.selection);
figma.on("selectionchange", () => postSelectionType(figma.currentPage.selection));
figma.ui.onmessage = msg => {
    if (msg.type === "create-style") {
        const selection = figma.currentPage.selection;
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
            };
            data.push(item);
            figma.root.setPluginData("styles", JSON.stringify(data));
            figma.ui.postMessage({
                type: "added-style",
                value: item
            });
        }
        else if (selection.length === 0) {
            alert("Please select a frame");
        }
        else {
            alert("Please select only one frame");
        }
    }
    if (msg.type === "delete-style") {
        data = data.filter(item => item.id !== msg.id);
        figma.root.setPluginData("styles", JSON.stringify(data));
        figma.ui.postMessage({
            type: "deleted-style",
            value: data,
        });
    }
    if (msg.type === "reorder-styles") {
        data = msg.items;
        figma.root.setPluginData("styles", JSON.stringify(data));
    }
    //figma.closePlugin();
};

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29kZS5qcyIsIm1hcHBpbmdzIjoiOzs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2NvbXBvdW5kLXN0eWxlcy1maWdtYS1wbHVnaW4vLi9zcmMvY29kZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBwb3N0U2VsZWN0aW9uVHlwZSA9IChzZWxlY3Rpb24pID0+IHtcbiAgICBzd2l0Y2ggKHRydWUpIHtcbiAgICAgICAgLy8gU2luZ2xlIGZyYW1lIHNlbGVjdGVkXG4gICAgICAgIGNhc2UgKHNlbGVjdGlvbi5sZW5ndGggPT09IDEgJiYgc2VsZWN0aW9uWzBdLnR5cGUgPT09IFwiRlJBTUVcIik6XG4gICAgICAgICAgICBjb25zdCBub2RlID0gc2VsZWN0aW9uWzBdO1xuICAgICAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2Uoe1xuICAgICAgICAgICAgICAgIHR5cGU6IFwic2luZ2xlLXNlbGVjdGlvblwiLFxuICAgICAgICAgICAgICAgIHZhbHVlOiB7XG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IG5vZGUubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgc3R5bGVzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxsczogbm9kZS5maWxscyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0cm9rZXM6IG5vZGUuc3Ryb2tlcyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvcExlZnRSYWRpdXM6IG5vZGUudG9wTGVmdFJhZGl1cyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvcFJpZ2h0UmFkaXVzOiBub2RlLnRvcFJpZ2h0UmFkaXVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgYm90dG9tTGVmdFJhZGl1czogbm9kZS5ib3R0b21MZWZ0UmFkaXVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgYm90dG9tUmlnaHRSYWRpdXM6IG5vZGUuYm90dG9tUmlnaHRSYWRpdXMsXG4gICAgICAgICAgICAgICAgICAgICAgICBlZmZlY3RzOiBub2RlLmVmZmVjdHMsXG4gICAgICAgICAgICAgICAgICAgICAgICBibGVuZE1vZGU6IG5vZGUuYmxlbmRNb2RlLFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgLy8gTXVsdGlwbGUgZnJhbWVzIHNlbGVjdGVkXG4gICAgICAgIGNhc2UgKHNlbGVjdGlvbi5sZW5ndGggPiAxICYmICFzZWxlY3Rpb24uc29tZShpdGVtID0+IGl0ZW0udHlwZSAhPT0gXCJGUkFNRVwiKSk6XG4gICAgICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7XG4gICAgICAgICAgICAgICAgdHlwZTogXCJtdWx0aS1zZWxlY3Rpb25cIixcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgKHNlbGVjdGlvbi5sZW5ndGggPT09IDApOlxuICAgICAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2Uoe1xuICAgICAgICAgICAgICAgIHR5cGU6IFwiZW1wdHktc2VsZWN0aW9uXCIsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAvLyBBbnl0aGluZyBlbHNlIGlzIGludmFsaWRcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcImludmFsaWQtc2VsZWN0aW9uXCIsXG4gICAgICAgICAgICB9KTtcbiAgICB9XG59O1xuZmlnbWEuc2hvd1VJKF9faHRtbF9fLCB7XG4gICAgd2lkdGg6IDUwMCxcbiAgICBoZWlnaHQ6IDgwMFxufSk7XG4vLyBmaWdtYS5yb290LnNldFBsdWdpbkRhdGEoXCJzdHlsZXNcIiwgXCJcIilcbmxldCBkYXRhID0gW107XG5jb25zdCByYXdEYXRhID0gZmlnbWEucm9vdC5nZXRQbHVnaW5EYXRhKFwic3R5bGVzXCIpO1xuaWYgKHJhd0RhdGEgIT09IFwiXCIpIHtcbiAgICBkYXRhID0gSlNPTi5wYXJzZShyYXdEYXRhKTtcbn1cbnBvc3RTZWxlY3Rpb25UeXBlKGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbik7XG5maWdtYS5vbihcInNlbGVjdGlvbmNoYW5nZVwiLCAoKSA9PiBwb3N0U2VsZWN0aW9uVHlwZShmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb24pKTtcbmZpZ21hLnVpLm9ubWVzc2FnZSA9IG1zZyA9PiB7XG4gICAgaWYgKG1zZy50eXBlID09PSBcImNyZWF0ZS1zdHlsZVwiKSB7XG4gICAgICAgIGNvbnN0IHNlbGVjdGlvbiA9IGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbjtcbiAgICAgICAgaWYgKHNlbGVjdGlvbi5sZW5ndGggPT09IDEgJiYgc2VsZWN0aW9uWzBdLnR5cGUgPT09IFwiRlJBTUVcIikge1xuICAgICAgICAgICAgY29uc3QgaXRlbSA9IHtcbiAgICAgICAgICAgICAgICBuYW1lOiBzZWxlY3Rpb25bMF0ubmFtZSxcbiAgICAgICAgICAgICAgICBpZDogbXNnLmlkLFxuICAgICAgICAgICAgICAgIHN0eWxlczoge1xuICAgICAgICAgICAgICAgICAgICBmaWxsczogc2VsZWN0aW9uWzBdLmZpbGxzLFxuICAgICAgICAgICAgICAgICAgICBzdHJva2VzOiBzZWxlY3Rpb25bMF0uc3Ryb2tlcyxcbiAgICAgICAgICAgICAgICAgICAgdG9wTGVmdFJhZGl1czogc2VsZWN0aW9uWzBdLnRvcExlZnRSYWRpdXMsXG4gICAgICAgICAgICAgICAgICAgIHRvcFJpZ2h0UmFkaXVzOiBzZWxlY3Rpb25bMF0udG9wUmlnaHRSYWRpdXMsXG4gICAgICAgICAgICAgICAgICAgIGJvdHRvbUxlZnRSYWRpdXM6IHNlbGVjdGlvblswXS5ib3R0b21MZWZ0UmFkaXVzLFxuICAgICAgICAgICAgICAgICAgICBib3R0b21SaWdodFJhZGl1czogc2VsZWN0aW9uWzBdLmJvdHRvbVJpZ2h0UmFkaXVzLFxuICAgICAgICAgICAgICAgICAgICBlZmZlY3RzOiBzZWxlY3Rpb25bMF0uZWZmZWN0cyxcbiAgICAgICAgICAgICAgICAgICAgYmxlbmRNb2RlOiBzZWxlY3Rpb25bMF0uYmxlbmRNb2RlLFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBkYXRhLnB1c2goaXRlbSk7XG4gICAgICAgICAgICBmaWdtYS5yb290LnNldFBsdWdpbkRhdGEoXCJzdHlsZXNcIiwgSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xuICAgICAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2Uoe1xuICAgICAgICAgICAgICAgIHR5cGU6IFwiYWRkZWQtc3R5bGVcIixcbiAgICAgICAgICAgICAgICB2YWx1ZTogaXRlbVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoc2VsZWN0aW9uLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgYWxlcnQoXCJQbGVhc2Ugc2VsZWN0IGEgZnJhbWVcIik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBhbGVydChcIlBsZWFzZSBzZWxlY3Qgb25seSBvbmUgZnJhbWVcIik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKG1zZy50eXBlID09PSBcImRlbGV0ZS1zdHlsZVwiKSB7XG4gICAgICAgIGRhdGEgPSBkYXRhLmZpbHRlcihpdGVtID0+IGl0ZW0uaWQgIT09IG1zZy5pZCk7XG4gICAgICAgIGZpZ21hLnJvb3Quc2V0UGx1Z2luRGF0YShcInN0eWxlc1wiLCBKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHtcbiAgICAgICAgICAgIHR5cGU6IFwiZGVsZXRlZC1zdHlsZVwiLFxuICAgICAgICAgICAgdmFsdWU6IGRhdGEsXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAobXNnLnR5cGUgPT09IFwicmVvcmRlci1zdHlsZXNcIikge1xuICAgICAgICBkYXRhID0gbXNnLml0ZW1zO1xuICAgICAgICBmaWdtYS5yb290LnNldFBsdWdpbkRhdGEoXCJzdHlsZXNcIiwgSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xuICAgIH1cbiAgICAvL2ZpZ21hLmNsb3NlUGx1Z2luKCk7XG59O1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9