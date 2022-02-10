import "./styles/index.css"

import * as React from "react"
import * as ReactDOM from "react-dom"
import { v4 as uuid } from "uuid"
import { ReactSortable } from "react-sortablejs"

import { Menu, Plus, Trash, CornerRightDown } from "react-feather";

type SelectionType = "SINGLE" | "MULTIPLE" | "EMPTY" |"INVALID"

const ListItem = ({ item, onDelete, canApply, canUpdate }) => {
  const handleDelete = () => onDelete(item.id)

  return (
    <li className="flex items-center justify-between p-1">
      <div className="flex items-center grow">
        <button className="mr-1 w-6 opacity-20 hover:opacity-100">
          <Menu size={12} />
        </button>
        <div className="mr-1 w-7 h-7 bg-red-300"></div>
        <input
          type="text"
          className="grow h-7 mr-1 px-1.5 rounded text-xs font-bold hover:text-sky-500 border-transparent hover:border-sky-500 focus:ring-sky-500"
          defaultValue={item.name} />
      </div>

      <div className="flex space-x-1">
        <button disabled={!canApply} title="Apply style to current selection">
          Apply
        </button>

        <button className="w-7" disabled={!canUpdate} title="Update style to match selection">
          <CornerRightDown size={16}/>
        </button>

        <button className="w-7" onClick={handleDelete} title="Delete style">
          <Trash size={16}/>
        </button>
      </div>
    </li>
  )
}

const App = () => {
  const [items, setItems] = React.useState<any[]>([])
  const [selection, setSelection] = React.useState<SelectionType>("INVALID")
  const [selectedNode, setSelectedNode] = React.useState<any>(null)

  // Send messages

  const handleAddStyle = (e:any) => {
    parent.postMessage({ pluginMessage: {
      type: "create-style",
      id: uuid(),
    }}, '*')
  }

  const handleDeleteStyle = (id:string) => {
    parent.postMessage({ pluginMessage: {
      type: "delete-style",
      id: id,
    }}, '*')
  }

  const handleSortItems = (sortedItems) => {
    console.log("sorting...")
    setItems(sortedItems)
    parent.postMessage({ pluginMessage: {
      type: "reorder-styles",
      items: sortedItems,
    }}, '*')
  }

  // Receive messages

  React.useEffect(() => {
    onmessage = (event) => {
      console.log("UI received a message:")
      const message = event.data.pluginMessage

      switch (message.type) {
        case "initialize":
          console.log(" -- initialized", message.value)
          setItems(message.value)
          break

        case "added-style":
          console.log(" -- added style", message.value)
          setItems([...items, message.value])
          break

        case "deleted-style":
          console.log(" -- deleted style", message.value)
          setItems(message.value)
          break

        case "single-selection":
          console.log(" -- single selection", message.value)
          setSelectedNode(message.value)
          setSelection("SINGLE")
          break

        case "multi-selection":
          console.log(" -- multi selection")
          setSelectedNode(null)
          setSelection("MULTIPLE")
          break

        case "invalid-selection":
          console.log(" -- invalid selection")
          setSelectedNode(null)
          setSelection("INVALID")
          break

        case "empty-selection":
          console.log(" -- empty selection")
          setSelection("EMPTY")
          break
      }
    }
  })

  return (
    <div>
      <ReactSortable list={items} setList={handleSortItems} className="sortable-list list-none divide-y border-b">
        {items.map((item) => {
          return (
            <ListItem
              key={item.id}
              item={item}
              onDelete={handleDeleteStyle}
              canApply={selection !== "INVALID"}
              canUpdate={selection === "SINGLE"}
            />
          )
        })}
      </ReactSortable>

      <div className="flex justify-between p-1 items-center">
        <span className="pl-2 text-xs text-gray-500 italic">
          {selection === "SINGLE" &&
            <span>Frame selected</span>
          }
          {selection === "MULTIPLE" && "Multiple frames selected"}
          {selection === "EMPTY" && "Select a frame"}
          {selection === "INVALID" &&
            <span className="bg-red-200 px-2 py-1 -ml-2 rounded">Select frames only</span>
          }
        </span>

        <div className="flex items-center">
          {selection === "SINGLE" &&
            <span className="text-xs text-gray-500 italic pr-1">Add style</span>
          }
          <button className="w-7 primary" disabled={selection !== "SINGLE"} onClick={handleAddStyle}>
            <Plus size={16} color="white"/>
          </button>
        </div>
      </div>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById("react-root"))
