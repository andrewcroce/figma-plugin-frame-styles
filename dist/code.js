/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/styleKeys.ts":
/*!**************************!*\
  !*** ./src/styleKeys.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "styleKeys": () => (/* binding */ styleKeys)
/* harmony export */ });
const styleKeys = [
    "fills",
    "strokes",
    "strokeWeight",
    "dashPattern",
    "topLeftRadius",
    "topRightRadius",
    "bottomLeftRadius",
    "bottomRightRadius",
    "effects",
    "blendMode"
];


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*********************!*\
  !*** ./src/code.ts ***!
  \*********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _styleKeys__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./styleKeys */ "./src/styleKeys.ts");

const postSelectionType = (selection) => {
    switch (true) {
        // Single frame selected
        case (selection.length === 1 && selection[0].type === "FRAME"):
            const node = selection[0];
            figma.ui.postMessage({
                type: "single-selection",
                value: {
                    name: node.name,
                    styles: Object.assign(_styleKeys__WEBPACK_IMPORTED_MODULE_0__.styleKeys.map(key => ({ [key]: node[key] })))
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
// console.log("RAW DATA", rawData)
if (rawData !== "") {
    data = JSON.parse(rawData);
    // console.log("PARSED DATA", data)
}
postSelectionType(figma.currentPage.selection);
figma.ui.postMessage({
    type: "initialize",
    value: data
});
figma.on("selectionchange", () => postSelectionType(figma.currentPage.selection));
figma.ui.onmessage = msg => {
    if (msg.type === "create-style") {
        const selection = figma.currentPage.selection;
        if (selection.length === 1 && selection[0].type === "FRAME") {
            const item = {
                name: selection[0].name,
                id: msg.id,
                styles: _styleKeys__WEBPACK_IMPORTED_MODULE_0__.styleKeys.reduce((obj, key) => (Object.assign(obj, {
                    [key]: selection[0][key]
                })), {})
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
    if (msg.type === "apply-style") {
        const selections = figma.currentPage.selection;
        const s = data.find((style) => style.id === msg.id);
        selections.forEach((selection) => {
            if (selection.type !== "FRAME") {
                throw new Error("Styles can only be applied to frames");
            }
            else {
                _styleKeys__WEBPACK_IMPORTED_MODULE_0__.styleKeys.forEach((key) => { selection[key] = s.styles[key]; });
                selection.setPluginData("styleId", s.id);
            }
        });
    }
    if (msg.type === "rename-style") {
        const i = data.findIndex((style) => style.id === msg.id);
        data[i].name = msg.name;
        figma.root.setPluginData("styles", JSON.stringify(data));
        figma.ui.postMessage({
            type: "renamed-style",
            value: data,
        });
    }
    if (msg.type === "reorder-styles") {
        data = msg.items;
        figma.root.setPluginData("styles", JSON.stringify(data));
    }
    //figma.closePlugin();
};

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29kZS5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztVQ1hBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7QUNOd0M7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMENBQTBDLHFEQUFhLFdBQVcsa0JBQWtCO0FBQ3BGO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLHdEQUFnQjtBQUN4QztBQUNBLGlCQUFpQixNQUFNO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQix5REFBaUIsWUFBWSxpQ0FBaUM7QUFDOUU7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZnJhbWUtc3R5bGVzLWZpZ21hLXBsdWdpbi8uL3NyYy9zdHlsZUtleXMudHMiLCJ3ZWJwYWNrOi8vZnJhbWUtc3R5bGVzLWZpZ21hLXBsdWdpbi93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9mcmFtZS1zdHlsZXMtZmlnbWEtcGx1Z2luL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9mcmFtZS1zdHlsZXMtZmlnbWEtcGx1Z2luL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vZnJhbWUtc3R5bGVzLWZpZ21hLXBsdWdpbi93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2ZyYW1lLXN0eWxlcy1maWdtYS1wbHVnaW4vLi9zcmMvY29kZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY29uc3Qgc3R5bGVLZXlzID0gW1xuICAgIFwiZmlsbHNcIixcbiAgICBcInN0cm9rZXNcIixcbiAgICBcInN0cm9rZVdlaWdodFwiLFxuICAgIFwiZGFzaFBhdHRlcm5cIixcbiAgICBcInRvcExlZnRSYWRpdXNcIixcbiAgICBcInRvcFJpZ2h0UmFkaXVzXCIsXG4gICAgXCJib3R0b21MZWZ0UmFkaXVzXCIsXG4gICAgXCJib3R0b21SaWdodFJhZGl1c1wiLFxuICAgIFwiZWZmZWN0c1wiLFxuICAgIFwiYmxlbmRNb2RlXCJcbl07XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7IHN0eWxlS2V5cyB9IGZyb20gXCIuL3N0eWxlS2V5c1wiO1xuY29uc3QgcG9zdFNlbGVjdGlvblR5cGUgPSAoc2VsZWN0aW9uKSA9PiB7XG4gICAgc3dpdGNoICh0cnVlKSB7XG4gICAgICAgIC8vIFNpbmdsZSBmcmFtZSBzZWxlY3RlZFxuICAgICAgICBjYXNlIChzZWxlY3Rpb24ubGVuZ3RoID09PSAxICYmIHNlbGVjdGlvblswXS50eXBlID09PSBcIkZSQU1FXCIpOlxuICAgICAgICAgICAgY29uc3Qgbm9kZSA9IHNlbGVjdGlvblswXTtcbiAgICAgICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcInNpbmdsZS1zZWxlY3Rpb25cIixcbiAgICAgICAgICAgICAgICB2YWx1ZToge1xuICAgICAgICAgICAgICAgICAgICBuYW1lOiBub2RlLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlczogT2JqZWN0LmFzc2lnbihzdHlsZUtleXMubWFwKGtleSA9PiAoeyBba2V5XTogbm9kZVtrZXldIH0pKSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAvLyBNdWx0aXBsZSBmcmFtZXMgc2VsZWN0ZWRcbiAgICAgICAgY2FzZSAoc2VsZWN0aW9uLmxlbmd0aCA+IDEgJiYgIXNlbGVjdGlvbi5zb21lKGl0ZW0gPT4gaXRlbS50eXBlICE9PSBcIkZSQU1FXCIpKTpcbiAgICAgICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcIm11bHRpLXNlbGVjdGlvblwiLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAoc2VsZWN0aW9uLmxlbmd0aCA9PT0gMCk6XG4gICAgICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7XG4gICAgICAgICAgICAgICAgdHlwZTogXCJlbXB0eS1zZWxlY3Rpb25cIixcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIC8vIEFueXRoaW5nIGVsc2UgaXMgaW52YWxpZFxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2Uoe1xuICAgICAgICAgICAgICAgIHR5cGU6IFwiaW52YWxpZC1zZWxlY3Rpb25cIixcbiAgICAgICAgICAgIH0pO1xuICAgIH1cbn07XG5maWdtYS5zaG93VUkoX19odG1sX18sIHtcbiAgICB3aWR0aDogNTAwLFxuICAgIGhlaWdodDogODAwXG59KTtcbi8vIGZpZ21hLnJvb3Quc2V0UGx1Z2luRGF0YShcInN0eWxlc1wiLCBcIlwiKVxubGV0IGRhdGEgPSBbXTtcbmNvbnN0IHJhd0RhdGEgPSBmaWdtYS5yb290LmdldFBsdWdpbkRhdGEoXCJzdHlsZXNcIik7XG4vLyBjb25zb2xlLmxvZyhcIlJBVyBEQVRBXCIsIHJhd0RhdGEpXG5pZiAocmF3RGF0YSAhPT0gXCJcIikge1xuICAgIGRhdGEgPSBKU09OLnBhcnNlKHJhd0RhdGEpO1xuICAgIC8vIGNvbnNvbGUubG9nKFwiUEFSU0VEIERBVEFcIiwgZGF0YSlcbn1cbnBvc3RTZWxlY3Rpb25UeXBlKGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbik7XG5maWdtYS51aS5wb3N0TWVzc2FnZSh7XG4gICAgdHlwZTogXCJpbml0aWFsaXplXCIsXG4gICAgdmFsdWU6IGRhdGFcbn0pO1xuZmlnbWEub24oXCJzZWxlY3Rpb25jaGFuZ2VcIiwgKCkgPT4gcG9zdFNlbGVjdGlvblR5cGUoZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uKSk7XG5maWdtYS51aS5vbm1lc3NhZ2UgPSBtc2cgPT4ge1xuICAgIGlmIChtc2cudHlwZSA9PT0gXCJjcmVhdGUtc3R5bGVcIikge1xuICAgICAgICBjb25zdCBzZWxlY3Rpb24gPSBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb247XG4gICAgICAgIGlmIChzZWxlY3Rpb24ubGVuZ3RoID09PSAxICYmIHNlbGVjdGlvblswXS50eXBlID09PSBcIkZSQU1FXCIpIHtcbiAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSB7XG4gICAgICAgICAgICAgICAgbmFtZTogc2VsZWN0aW9uWzBdLm5hbWUsXG4gICAgICAgICAgICAgICAgaWQ6IG1zZy5pZCxcbiAgICAgICAgICAgICAgICBzdHlsZXM6IHN0eWxlS2V5cy5yZWR1Y2UoKG9iaiwga2V5KSA9PiAoT2JqZWN0LmFzc2lnbihvYmosIHtcbiAgICAgICAgICAgICAgICAgICAgW2tleV06IHNlbGVjdGlvblswXVtrZXldXG4gICAgICAgICAgICAgICAgfSkpLCB7fSlcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBkYXRhLnB1c2goaXRlbSk7XG4gICAgICAgICAgICBmaWdtYS5yb290LnNldFBsdWdpbkRhdGEoXCJzdHlsZXNcIiwgSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xuICAgICAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2Uoe1xuICAgICAgICAgICAgICAgIHR5cGU6IFwiYWRkZWQtc3R5bGVcIixcbiAgICAgICAgICAgICAgICB2YWx1ZTogaXRlbVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoc2VsZWN0aW9uLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgYWxlcnQoXCJQbGVhc2Ugc2VsZWN0IGEgZnJhbWVcIik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBhbGVydChcIlBsZWFzZSBzZWxlY3Qgb25seSBvbmUgZnJhbWVcIik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKG1zZy50eXBlID09PSBcImRlbGV0ZS1zdHlsZVwiKSB7XG4gICAgICAgIGRhdGEgPSBkYXRhLmZpbHRlcihpdGVtID0+IGl0ZW0uaWQgIT09IG1zZy5pZCk7XG4gICAgICAgIGZpZ21hLnJvb3Quc2V0UGx1Z2luRGF0YShcInN0eWxlc1wiLCBKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHtcbiAgICAgICAgICAgIHR5cGU6IFwiZGVsZXRlZC1zdHlsZVwiLFxuICAgICAgICAgICAgdmFsdWU6IGRhdGEsXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAobXNnLnR5cGUgPT09IFwiYXBwbHktc3R5bGVcIikge1xuICAgICAgICBjb25zdCBzZWxlY3Rpb25zID0gZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uO1xuICAgICAgICBjb25zdCBzID0gZGF0YS5maW5kKChzdHlsZSkgPT4gc3R5bGUuaWQgPT09IG1zZy5pZCk7XG4gICAgICAgIHNlbGVjdGlvbnMuZm9yRWFjaCgoc2VsZWN0aW9uKSA9PiB7XG4gICAgICAgICAgICBpZiAoc2VsZWN0aW9uLnR5cGUgIT09IFwiRlJBTUVcIikge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlN0eWxlcyBjYW4gb25seSBiZSBhcHBsaWVkIHRvIGZyYW1lc1wiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHN0eWxlS2V5cy5mb3JFYWNoKChrZXkpID0+IHsgc2VsZWN0aW9uW2tleV0gPSBzLnN0eWxlc1trZXldOyB9KTtcbiAgICAgICAgICAgICAgICBzZWxlY3Rpb24uc2V0UGx1Z2luRGF0YShcInN0eWxlSWRcIiwgcy5pZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAobXNnLnR5cGUgPT09IFwicmVuYW1lLXN0eWxlXCIpIHtcbiAgICAgICAgY29uc3QgaSA9IGRhdGEuZmluZEluZGV4KChzdHlsZSkgPT4gc3R5bGUuaWQgPT09IG1zZy5pZCk7XG4gICAgICAgIGRhdGFbaV0ubmFtZSA9IG1zZy5uYW1lO1xuICAgICAgICBmaWdtYS5yb290LnNldFBsdWdpbkRhdGEoXCJzdHlsZXNcIiwgSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xuICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7XG4gICAgICAgICAgICB0eXBlOiBcInJlbmFtZWQtc3R5bGVcIixcbiAgICAgICAgICAgIHZhbHVlOiBkYXRhLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgaWYgKG1zZy50eXBlID09PSBcInJlb3JkZXItc3R5bGVzXCIpIHtcbiAgICAgICAgZGF0YSA9IG1zZy5pdGVtcztcbiAgICAgICAgZmlnbWEucm9vdC5zZXRQbHVnaW5EYXRhKFwic3R5bGVzXCIsIEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbiAgICB9XG4gICAgLy9maWdtYS5jbG9zZVBsdWdpbigpO1xufTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==