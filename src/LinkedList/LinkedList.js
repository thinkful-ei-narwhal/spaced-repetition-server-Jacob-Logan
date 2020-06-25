const { head } = require("../app");

class _Node {
  constructor(value, next) {
    this.value = value;
    this.next = next;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
  }

  insertFirst(item) {
    this.head = new _Node(item, this.head);
  }

  // insertLast(item) {
  //   if (this.head === null) {
  //     this.insertFirst(item);
  //     return;
  //   }

  //   let node = this.head;
  //   while (node.next !== null) {
  //     node = node.next;
  //   }
  // }
  insertLast(item) {
    if (this.head === null) {
      this.insertFirst(item);
      return;
    }

    let node = this.head;
    while (node.next !== null) {
      node = node.next;
    }

    node.next = new _Node(item, null);
  }

  remove(item) {
    let node = this.head;
    let previousNode = null;
    while (node.value !== item) {
      if (node.next === null) {
        //if value is not in the linked list
        console.log('Sorry try another value');
        return null;
      }
      previousNode = node;
      node = node.next;
    }
    previousNode.next = node.next;
  }

  find(item) {
    let node = this.head;
    while (node.value !== item) {
      node = node.next;

      if (node.value === item) {
        return node;
      }
    }
    return null;
  }

  // insertBefore(item, key) {
  //   let node = this.head;
  //   let prevNode = null;
  //   while (node.value !== key) {
  //     prevNode = node;
  //     node = node.next;
  //   }
  //   return null;
  // }



  insertBefore(item, key) {
    let node = this.head;
    let prevNode = null;
    while (node.value !== key) {
      prevNode = node;
      node = node.next;
    }
  }
  insertAt(item, index) {
    console.log('this.listNodes().length', this.listNodes().length);
    if (index < 0) {
      console.log('index < 0', index);
      return;
    }
    if (index > this.listNodes().length) {
      console.log('outside LL');
    }
    if (index === 0) {
      this.insertFirst(item);
    }
    else {
      const node = this._findNode(index - 1);
      const newNode = new _Node(item, null);
      newNode.next = node.next;
      node.next = newNode;
    }
  }
  // insertAt(item, index) {
  //   let node = this.head;
  //   for (let i = 0; i < index - 1; i++) {
  //     if (node.next !== null) {
  //       node = node.next;
  //     }
  //     else {
  //       this.insertLast(item);
  //     }
  //   }
  //   node.next = new _Node(item, node.next);
  // }
  // insertAt(item, index) {
  //   let currNode = this.head;
  //   // console.log('index', index)
  //   // console.log('currnode', this.head)
  //   if (currNode.next === null) {
  //     this.insertLast(item);
  //   }
  //   if (index === 0) {
  //     this.insertFirst(item);
  //   }
  //   let i = 1;
  //   while (currNode.next !== null || i < index - 1) {
  //     currNode = currNode.next;
  //     i += 1;
  //     // console.log('i', i)
  //   }
  //   currNode.next = new _Node(item, currNode.next);
  // }
  // insertAt(item, index) {
  //   let node = this.head;
  //   for (let i = 1; i < index; i++) {
  //     node = node.next;
  //   }
  //   node.next = new _Node(item, node.next);
  // }

  printAllNodes() {
    let node = this.head;
    console.log('First node: ', this.head);
    while (node !== null) {
      console.log('Node next= ', node.next);
      node = node.next;
    }
  }
  // printAllNodes() {
  //   let node = this.head;
  //   console.log("First node: ", this.head);
  //   while (node !== null) {
  //     console.log("Node next= ", node.next);
  //     node = node.next;
  //   }
  //   node.next = new _Node(item, node.next);
  // }
  _findNode(position) {
    let node = this.head;
    for (let i = 0; i < position; i++) {
      node = node.next;
    }
    return node;
  }

  size() {
    let i = 0;
    let node = this.head;
    while (node !== null) {
      node = node.next;
      i++;
    }
    return i;
  }

  isEmpty() {
    return this.head ? false : true;
  }

  findPrevious(item) {
    let node = this.head;
    let prevNode = null;
    while (node.value !== item) {
      prevNode = node;
      node = node.next;
    }
    return prevNode;
  }

  findLast() {
    let node = this.head;
    while (node.next) {
      node = node.next;
    }
  }

  moveHeadBy(memval) {
    let current = this.head;

    this.head = this.head.next;

    this.insertAt(current.value, memval);
  }

  listNodes() {
    let node = this.head;
    const arr = [];
    while (node) {
      arr.push(node);
      node = node.next;
    }
    return arr;
  }

  forEach(callback) {
    let node = this.head;
    const arr = [];
    while (node) {
      arr.push(callback(node));
      node = node.next;
    }
    return arr;
  }
}

module.exports = LinkedList;
