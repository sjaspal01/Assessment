import React from "react";
import Tree from "./index";
import { render } from "@testing-library/react";

const createNode = (name: string, children: any[] = []) => ({ name, children });
// Mocking a simple snapshot test
describe('Tree operations', () => {
  let treeData: any;

  beforeEach(() => {
    treeData = createNode("root", [
      createNode("ant"),
      createNode("bear", [
        createNode("cat"),
        createNode("dog", [createNode("elephant")]),
      ]),
      createNode("dolphin"),
    ]);
  });

  test("it matches the snapshot", () => {
    const { asFragment } = render(<Tree />);
    expect(asFragment()).toMatchSnapshot();
  });

   test("should add a new element", () => {
     const parentNode = treeData.children[1]; // bear
     const newNodeName = "fox";
     parentNode.children.push(createNode(newNodeName));

     expect(parentNode.children[2].name).toBe("fox");
   });

   test("should remove an existing element", () => {
     const parentNode = treeData.children[1]; // bear
     const childToRemove = parentNode.children[1]; // dog
     parentNode.children = parentNode.children.filter(
       (child:any) => child.name !== childToRemove.name
     );

     expect(parentNode.children.length).toBe(1);
     expect(parentNode.children[0].name).toBe("cat");
   });
});