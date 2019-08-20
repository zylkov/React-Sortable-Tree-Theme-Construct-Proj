import React, { Component } from 'react';
import SortableTree, { toggleExpandedForAll } from 'react-sortable-tree';
import CustomTheme from '../index';
import './app.css';
import {removeNodeAtPath,
        getDescendantCount, 
        addNodeUnderParent, 
        changeNodeAtPath} from './tree-data-utils'

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchString: '',
      searchFocusIndex: 0,
      searchFoundCount: null,
      treeData: [
        { title: 'Страница 1', subtitle:[{id:1,name:"Сделать то"}, {id:2, name:"Сделать этоо"}] },
        { title: 'Страница 2', subtitle:[{id:1,name:"Сделать то"}, {id:2, name:"Сделать этоо"}] },
        { title: 'Главная', children: [{ title: 'Информация' }] },
      ],
    };
    this.updateTreeData = this.updateTreeData.bind(this);
    this.expandAll = this.expandAll.bind(this);
    this.collapseAll = this.collapseAll.bind(this);
    this.removeNode = this.removeNode.bind(this);
    this.testNode = this.testNode.bind(this);
    this.addNodeChild = this.addNodeChild.bind(this);
    this.addNode = this.addNode.bind(this);
    this.changeNode = this.changeNode.bind(this);
    this.addFunc = this.addFunc.bind(this);
    this.removeFunc = this.removeFunc.bind(this);
    this.changeFunc = this.changeFunc.bind(this);
  }

  updateTreeData(treeData) {
    this.setState({ treeData });
    return true
  }

  expand(expanded) {
    this.setState({
      treeData: toggleExpandedForAll({
        treeData: this.state.treeData,
        expanded,
      }),
    });
  }

  addFunc(rowInfo){
    let {node, treeIndex, path} = rowInfo;
    const result = prompt("Введите название новой функции:","Нет название")
    this.updateTreeData(
      changeNodeAtPath({
        treeData:this.state.treeData,
        newNode: node.hasOwnProperty("subtitle") ? 
        { 
          ...node,
          subtitle:[
              ...node.subtitle,
              {
                id:node.subtitle.length + 1,
                name:result
              }
            ] 
        } 
        : {
          ...node,
          subtitle:[{
            id:1,
            name:result
          }]
        } ,
        path:path,
        ignoreCollapsed:true,
        getNodeKey: ({node: TreeNode, treeIndex: number}) => {
          console.log(number);
          return number;
        }
      }))
  }

  removeFunc(rowInfo,id){
    let {node, treeIndex, path} = rowInfo;
    this.updateTreeData(
      changeNodeAtPath({
        treeData:this.state.treeData,
        newNode: { 
          ...node,
          subtitle: node.subtitle.filter(obj=>obj.id !== id)
        },
        path:path,
        ignoreCollapsed:true,
        getNodeKey: ({node: TreeNode, treeIndex: number}) => {
          console.log(number);
          return number;
        }
      }))
  }

  changeFunc(rowInfo,id){
    let {node, treeIndex, path} = rowInfo;
    const result = prompt("Введите название новой функции:", node.subtitle.find(obj=>obj.id === id).name)
    const sortobj = (obj1,obj2) => (obj1-obj2)

    this.updateTreeData(
      changeNodeAtPath({
        treeData:this.state.treeData,
        newNode: { 
          ...node,
          subtitle: [
            ...node.subtitle.map(obj=> obj.id !== id ? obj : 
              {
                id,
                name:result
              })
          ]
        },
        path:path,
        ignoreCollapsed:true,
        getNodeKey: ({node: TreeNode, treeIndex: number}) => {
          console.log(number);
          return number;
        }
      }))
  }

  addNode(){
    const result = prompt("Введите название блока:","Нет названия")
    const newObj = {title:result}
    
    this.updateTreeData([...this.state.treeData,newObj])
  }

  addNodeChild(rowInfo){
    let {node, treeIndex, path} = rowInfo;
    const result = prompt("Введите название блока:","Нет названия")
    this.updateTreeData(
      addNodeUnderParent({
        treeData:this.state.treeData,
        newNode:{ title:result },
        parentKey:treeIndex,
        ignoreCollapsed:true,
        getNodeKey: ({node: TreeNode, treeIndex: number}) => {
          console.log(number);
          return number;
        }
      }).treeData)
  }

  changeNode(rowInfo){
    let {node, treeIndex, path} = rowInfo;
    const result = prompt("Введите название блока:",node.title)
    this.updateTreeData(
      changeNodeAtPath({
        treeData:this.state.treeData,
        newNode:{ ...node,title:result },
        path:path,
        ignoreCollapsed:true,
        getNodeKey: ({node: TreeNode, treeIndex: number}) => {
          console.log(number);
          return number;
        }
      }))
  }

  testNode(rowInfo){
    let {node, treeIndex, path} = rowInfo;
    const result = prompt("Введите название новой функции:","Нет название")
    this.updateTreeData(
      changeNodeAtPath({
        treeData:this.state.treeData,
        newNode: node.hasOwnProperty("subtitle") ? { ...node,subtitle:[...node.subtitle, result] } : {...node,subtitle:[result]} ,
        path:path,
        ignoreCollapsed:true,
        getNodeKey: ({node: TreeNode, treeIndex: number}) => {
          console.log(number);
          return number;
        }
      }))
  }

  removeNode(rowInfo){
    let {node, treeIndex, path} = rowInfo;
    let alldelete = true
    let bufferTreeData = this.state.treeData

    if(node.hasOwnProperty("children") && node.children.length > 0){
      alldelete = confirm(`В объекте ${node.title} были обноружены зависимые объекты.
      Удалить с зависимыми объектами?`)
    }
    
    if(!alldelete)
    {
      let newPath = [-1].concat(path)[path.length - 1]
      console.log("new path",newPath)
      

      if(newPath === -1){
        for (let index = 0; index < node.children.length; index++) {
          
          const element = node.children[index];
          bufferTreeData = [...bufferTreeData, element]
        }
        
      }
      else {
        node.children.forEach((element,i) => {
          console.log(element)
          bufferTreeData = 
              addNodeUnderParent({
              treeData:bufferTreeData,
              newNode:element,
              parentKey:newPath,
              ignoreCollapsed:true,
              getNodeKey: ({node: TreeNode, treeIndex: number}) => {
                console.log(number);
                return number;
              }
            }).treeData
          
        })
      }
      console.log("buffer Tree Data after change position",bufferTreeData)

      
    }
    bufferTreeData = removeNodeAtPath({
        treeData:bufferTreeData,
        path,
        getNodeKey: ({node: TreeNode, treeIndex: number}) => {
            console.log(number);
            return number;
        },
        ignoreCollapsed: false
      })
    
    console.log("buffer Tree Data after del el",bufferTreeData)
    this.updateTreeData(bufferTreeData)

  }



  expandAll() {
    this.expand(true);
  }

  collapseAll() {
    this.expand(false);
  }

  render() {
    const {
      treeData,
      searchString,
      searchFocusIndex,
      searchFoundCount,
    } = this.state;

    const alertNodeInfo = ({ node, path, treeIndex }) => {
      const objectString = Object.keys(node)
        .map(k => (k === 'children' ? 'children: Array' : `${k}: '${node[k]}'`))
        .join(',\n   ');

      global.alert(
        'Info passed to the icon and button generators:\n\n' +
          `node: {\n   ${objectString}\n},\n` +
          `path: [${path.join(', ')}],\n` +
          `treeIndex: ${treeIndex}`
      );
    };

    const selectPrevMatch = () =>
      this.setState({
        searchFocusIndex:
          searchFocusIndex !== null
            ? (searchFoundCount + searchFocusIndex - 1) % searchFoundCount
            : searchFoundCount - 1,
      });

    const selectNextMatch = () =>
      this.setState({
        searchFocusIndex:
          searchFocusIndex !== null
            ? (searchFocusIndex + 1) % searchFoundCount
            : 0,
      });

    return (
      <div
        style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}
      >
        <div style={{ flex: '0 0 auto', padding: '0 15px' }}>
          <h3>Full Node Drag Theme</h3>
          <button onClick={this.expandAll}>Expand All</button>
          <button onClick={this.collapseAll}>Collapse All</button>
          <button onClick={()=>this.addNode()}>Add new Node</button>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <form
            style={{ display: 'inline-block' }}
            onSubmit={event => {
              event.preventDefault();
            }}
          >
            <label htmlFor="find-box">
              Search:&nbsp;
              <input
                id="find-box"
                type="text"
                value={searchString}
                onChange={event =>
                  this.setState({ searchString: event.target.value })
                }
              />
            </label>

            <button
              type="button"
              disabled={!searchFoundCount}
              onClick={selectPrevMatch}
            >
              &lt;
            </button>

            <button
              type="submit"
              disabled={!searchFoundCount}
              onClick={selectNextMatch}
            >
              &gt;
            </button>

            <span>
              &nbsp;
              {searchFoundCount > 0 ? searchFocusIndex + 1 : 0}
              &nbsp;/&nbsp;
              {searchFoundCount || 0}
            </span>
          </form>
        </div>

        <div style={{ flex: '1 0 50%', padding: '0 0 0 15px' }}>
          <SortableTree
            rowHeight={120}
            scaffoldBlockPxWidth={100}
            theme={CustomTheme}
            treeData={treeData}
            onChange={this.updateTreeData}
            searchQuery={searchString}
            searchFocusOffset={searchFocusIndex}
            searchFinishCallback={matches =>
              this.setState({
                searchFoundCount: matches.length,
                searchFocusIndex:
                  matches.length > 0 ? searchFocusIndex % matches.length : 0,
              })
            }
            canDrag={({ node }) => !node.dragDisabled}
            generateNodeProps={rowInfo => ({
              buttons: [
                <button onClick={() => alertNodeInfo(rowInfo)}>i</button>,
                <button onClick={() => this.removeNode(rowInfo)}>x</button>,
                <button onClick={() => this.addNodeChild(rowInfo)}>+</button>,
                <button onClick={() => this.changeNode(rowInfo)}>c</button>,
                <button onClick={() => this.addFunc(rowInfo)}>a</button>,
                <button onClick={() => this.testNode(rowInfo)}>t</button>,
              ],
              buttonsfunc:[
                {
                  name:"i",
                  func:(id)=>{console.log(id)}
                },
                {
                  name:"x",
                  func:(id)=>{this.removeFunc(rowInfo,id)}
                },
                {
                  name:"c",
                  func:(id)=>{this.changeFunc(rowInfo,id)}
                }
              ]
            })}
          />
          
        </div>
        
      </div>
    );
  }
}

export default App;
