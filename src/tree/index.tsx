import "./index.css";

import React, { useEffect, useState } from "react";
import { getTreeData, saveTreeData } from "./api";

import { debounce } from "./utility";

type Node = {
  name: string;
  children?: Node[];
};

/**
 * 
 * @param name - name of the node
 * @param level - level of the node
 * @returns display name of the node with appropriate number of periods
 */
const addPeriods = (name:string, level:number) => {
  return name.charAt(0) + ".".repeat(level) + name.slice(1);
};

/**
 * 
 * @param node - node whose children are to be alphabetized, recursively called
 */
const alphabetizeTree = (node: Node) => {
  if (node.children) {
    node.children.sort((a, b) => a.name.localeCompare(b.name));
    node.children.forEach(alphabetizeTree);
  }
};

/**
 * 
 * @param node - node to be rendered
 * @param addNode - function that is called when a node is added
 * @param removeNode - function to be called when node is removed
 * @param indexNo - index of the node within the children array
 * @param level - level of the tree
 * @returns - render for tree with appropriate interactive elements
 */
const renderTree = (
  node: Node,
  addNode: Function,
  removeNode: Function,
  indexNo: number,
  level = 0
) => (
  <div className="node" key={node.name+indexNo}>
    {addPeriods(node.name, level)}
    <button onClick={() => removeNode(node)}>❌</button>
    {node.children && (
      <div className="children">
        {node.children.map((child, index) =>
          renderTree(child, addNode, removeNode, index,  level + 1)
        )}
        <input
          className="children"
          type="text"
          placeholder="Add child"
          onKeyDown={(e) => addNode(e, node)}
        />
      </div>
    )}
  </div>
);

const Tree = () => {
  const [treeData, setTreeData] = useState(null);
  const [isAlphabetized, setIsAlphabetized] = useState(false);
  const [originalData, setOriginalData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getTreeData();
      setTreeData(data);
      setOriginalData(data);
    };
    fetchData();
  }, []);

  /**
   * Function to determine order of sorting and set data accordingly
   */
  const toggleAlphabetize = () => {
    if (isAlphabetized) {
      setTreeData(JSON.parse(JSON.stringify(originalData)));
      setIsAlphabetized(false);
    } else {
      const newTreeData = JSON.parse(JSON.stringify(originalData));
      alphabetizeTree(newTreeData);
      setTreeData(newTreeData);
      setIsAlphabetized(true);
    }
  };

  /**
   * Debounced function to add node
   */
  const addNode = debounce(async (e: any, parentNode: Node) => {
    if (e.key === "Enter") {
      const newName = e.target.value;
      if (!parentNode.children) {
        parentNode.children = [];
      }
      parentNode.children.push({ name: newName });
      await saveTreeData(treeData);
      setTreeData({ ...treeData });
      e.target.value = "";
    }
  }, 300);

  /**
   * 
   * @param node - node to be removed
   */
  const removeNode = async (node: Node) => {
    const findAndRemove = (parent: Node, name: string) => {
      parent.children = parent?.children?.filter((child) => child.name !== name);
      parent?.children?.forEach((child) => findAndRemove(child, name));
    };
    findAndRemove(treeData, node.name);
    await saveTreeData(treeData);
    setTreeData({ ...treeData });
  };

   if (!treeData) {
     return <div>Loading...</div>;
   }
   
  return (
    <div className="tree">
      <button onClick={toggleAlphabetize}>
        {isAlphabetized ? "Restore Original Order" : "Alphabetize"}
      </button>
      {renderTree(treeData, addNode, removeNode, 0)}
    </div>
  );
}

export default Tree;