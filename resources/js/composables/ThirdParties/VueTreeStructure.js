const moveObject = (tree, objectId, targetId,position) => {
    let originalParent = null;
    let originalIndex = 0;

    const findAndRemove = (tree, id, parent = null) => {
        for (let i = 0; i < tree.length; i++) {
            if (tree[i].id === id) {
                originalParent = parent;
                originalIndex = i;
                return tree.splice(i, 1)[0];
            }
            if (tree[i].children) {
                const result = findAndRemove(tree[i].children, id, tree[i]);
                if (result) return result;
            }
        }
        return null;
    };

    const object = findAndRemove(tree, objectId);
    if (object) {
        if (object.type === 'file' && isTargetFile(tree, targetId)) {
            // Invalid move, restore the object
            if (originalParent) {
                originalParent.children.splice(originalIndex, 0, object);
            } else {
                // Handle the case when the item was at the root level
                tree.splice(originalIndex, 0, object);
            }
            return false;
        }
        findAndInsert(tree, targetId, object,position);
        return true;
    } else {
        console.log("Object with ID " + objectId + " not found.");
        return false;
    }
};
const findAndInsert =(tree, targetId, object,position) =>{
    for (const item of tree) {
        if (item.id === targetId) {
            item.children.unshift(object);
            return true;
        }
        if (item.children && findAndInsert(item.children, targetId, object)) {
            return true;
        }
    }
    // if (position === 'RIGHT') {
    //     tree.push(object);
    //     return true;
    // }
    return false;
}
const isTargetFile = (tree, targetId) => {
    const target = findItem(tree, targetId);
    return target ? target.type === 'file' : false;
};

const findItem = (tree, id) => {
    for (const item of tree) {
        if (item.id === id) {
            return item;
        }
        if (item.children) {
            const found = findItem(item.children, id);
            if (found) return found;
        }
    }
    return null;
};

const renameItem = (tree, itemId, newName) => {
    const item = findItem(tree, itemId);
    if (item) {
        item.name = newName;
        return true;
    }
    return false;
};

const deleteItem = (tree, itemId, parent = null) => {
    for (let i = 0; i < tree.length; i++) {
        if (tree[i].id === itemId) {
            tree.splice(i, 1);
            return true;
        }
        if (tree[i].children && deleteItem(tree[i].children, itemId, tree[i])) {
            return true;
        }
    }
    return false;
};

export { moveObject, renameItem, deleteItem };
