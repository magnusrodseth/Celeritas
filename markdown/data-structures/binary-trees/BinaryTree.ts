const markdown = `
~~~python

from typing import List

# These constants are later used to validate a binary search tree
NEGATIVE_INFINITY = float('-inf')
POSITIVE_INFINITY = float('inf')


class _Node:
    __value: int
    _left_child = None
    _right_child = None

    def __init__(self, value: int):
        self.__value = value

    @property
    def value(self):
        return self.__value

    @property
    def left_child(self):
        return self._left_child

    @property
    def right_child(self):
        return self._right_child

    def __str__(self):
        return str(self.__value)


class Tree:
    __root: _Node or None = None

    @property
    def root(self):
        return self.__root

    def insert(self, value: int) -> None:
        """
        Inserts a value into the binary tree. The value is wrapped in a _Node.

        :param value: is the value to be inserted
        """

        # Tree is empty
        if self.__root is None:
            self.__root = _Node(value)
            return

        # Tree has root and potentially children
        current = self.__root

        while current:
            if value < current.value:
                if not current.left_child:
                    current._left_child = _Node(value)
                    return
                else:
                    current = current.left_child
            elif value > current.value:
                if not current.right_child:
                    current._right_child = _Node(value)
                    return
                else:
                    current = current.right_child

    def contains(self, value: int) -> bool:
        """
        Checks if the binary tree contains the value.

        :param value: is the value to find.
        :return: a boolean value determining if the binary tree contains the value.
        """

        # Tree is empty
        if self.__root is None:
            return False

        current = self.__root

        while current:
            # Found value in tree
            if value == current.value:
                return True

            if value < current.value:
                current = current.left_child
            elif value > current.value:
                current = current.right_child

        return False

    def equals(self, tree) -> bool:
        """
        Checks this and another tree for equality recursively.

        :param tree: is the tree to check for equality.
        :return: a boolean value determining if the trees are equal.
        """
        if tree is None:
            return False

        return self.__equals(self.__root, tree.__root)

    def __equals(self, first: _Node, second: _Node) -> bool:
        """
        The implementation detail to check this and another tree for equality recursively,
        using depth-first search pre-order traversal.

        :param first: is the first node to check.
        :param second: is the second node to check.
        :return: a boolean value determining if the trees are equal.
        """

        # Both trees are empty
        if first is None and second is None:
            return True

        # Both trees have defined nodes and we should check left and right subtrees for equality
        if first and second:
            return first.value == second.value
                   and self.__equals(first.left_child, second.left_child)
                   and self.__equals(first.right_child, second.right_child)

        # These nodes are not equal
        return False

    def is_binary_search_tree(self) -> bool:
        """
        Checks if this tree is a binary search tree recursively.
        A tree is a binary search tree if all nodes in the left subtree is less than the root node,
        and all nodes in the right subtree is greater than the root node.

        :return: a boolean value determining if the tree is a binary search tree.
        """

        # The minimum value for a root node is negative infinity.
        # The maximum value for a root node is positive infinity.
        return self.__is_binary_search_tree(self.__root, NEGATIVE_INFINITY, POSITIVE_INFINITY)

    def __is_binary_search_tree(self, node: _Node, min_value: float, max_value: float) -> bool:
        """
        The implementation detail of checking if this tree is a binary search tree recursively.
        A tree is a binary search tree if all nodes in the left subtree is less than the root node,
        and all nodes in the right subtree is greater than the root node.

        :param node: is the node to validate
        :param min_value: is the node's minimum value.
        :param max_value: is the node's maximum value.
        :return: a boolean value determining if the tree is a binary search tree.
        """
        if node is None:
            return True

        # Node value is out of bounds
        if node.value < min_value or node.value > max_value:
            return False

        return self.__is_binary_search_tree(node.left_child, min_value, node.value - 1)
               and self.__is_binary_search_tree(node.right_child, node.value + 1, max_value)

    def get_nodes_with_distance(self, n: int) -> List[_Node]:
        """
        Gets nodes with distance n from the root of the tree recursively.

        :param n: is the distance from the root. Note that the root node has distance 0 from itself.
        :return: a list of nodes with distance n from the root node.
        """

        nodes: List[_Node] = []

        # Recursively add nodes with distance n from root node.
        self.__get_nodes_with_distance(self.__root, n, nodes)

        return nodes

    def __get_nodes_with_distance(self, node: _Node, n: int, nodes: List[_Node]):
        """
        The implementation detail of getting nodes with distance n from the root node.

        :param node: is the current node to compare.
        :param n: is the current distance from root.
        :param nodes: is the list of nodes with distance n from the root node.
        """
        if node is None:
            return

        if n == 0:
            nodes.append(node)
            return

        # Recursively find the nodes with distance n from the root node.
        if node.left_child:
            self.__get_nodes_with_distance(node.left_child, n - 1, nodes)
        if node.right_child:
            self.__get_nodes_with_distance(node.right_child, n - 1, nodes)

    def minimum_value(self) -> int:
        """
        Finds the minimum value in a binary tree. O(n).
        :return: the minimum value in the tree.
        """
        if self.__root is None:
            raise AttributeError("Tree is empty and has no minimum value.")

        return self.__minimum_value(self.__root)

    def __minimum_value(self, root: _Node) -> int:
        """
        The implementation detail of finding the minimum value in a binary tree. O(n).

        :rtype: the minimum value in the binary tree.
        """
        if self.__is_leaf_node(root):
            return root.value

        # Find minimum value of left subtree
        minimum_value_left = self.__minimum_value(self.__root.left_child)

        # Find minimum value of right subtree
        minimum_value_right = self.__minimum_value(self.__root.right_child)

        # Find minimum value in subtrees
        minimum_value_subtree = min(minimum_value_left, minimum_value_right)

        return min(minimum_value_subtree, root.value)

    def minimum_value_in_binary_search_tree(self) -> int:
        """
        Finds the minimum value in a binary search tree. Recall that in a binary search tree, the left subtree's
        values will always be less than the right subtree's values. O(log n).

        :return: the minimum value in the binary search tree.
        """
        if self.__root is None:
            raise AttributeError(
                "Binary search tree is empty, and has no minimum value.")

        current = self.__root
        last = current.left_child

        while current:
            last = current

            # In a binary search tree, the leftmost leaf node will always be the minimum value.
            current = current.left_child

        return last.value

    def maximum_value_in_binary_search_tree(self) -> int:
        """
        Finds the maximum value in a binary search tree. Recall that in a binary search tree, the left subtree's
        values will always be less than the right subtree's values. O(log n).

        :return: the maximum value in the binary search tree.
        """
        if self.__root is None:
            raise AttributeError(
                "Binary search tree is empty, and has no maximum value.")

        current = self.__root
        last = current.right_child

        while current:
            last = current

            # In a binary search tree, the rightmost leaf node will always be the maximum value.
            current = current.right_child

        return last.value

    def __is_leaf_node(self, node: _Node) -> bool:
        """
        Checks if a node is a leaf node.

        :rtype: a boolean value determining if the node is a leaf node.
        """
        return (node.left_child is None) and (node.right_child is None)

    def height(self) -> int:
        """
        Calculates the height of the binary tree using recursion.

        :return: the height of the tree, -1 if the tree is empty.
        """

        # Tree is empty
        if self.__root is None:
            return -1

        return self.__height(self.__root)

    def __height(self, root: _Node) -> int:
        """
        The implementation detail of calculating the height of the binary tree using recursion.

        :param root: is the current node.
        :return: the height of the tree.
        """
        if self.__is_leaf_node(root):
            return 0

        return 1 + max(self.__height(root.left_child), self.__height(root.right_child))

    def traverse_pre_order(self) -> None:
        """
        An implementation of pre-order traversal of a tree using recursion.
        """
        self.__traverse_pre_order(self.__root)

    def __traverse_pre_order(self, root: _Node) -> None:
        """
        The implementation detail of pre-order traversal of a tree using recursion.

        :param root: is the current Node, or None if there are no more child nodes.
        """

        # Base condition
        if root is None:
            return

        # Root, left, right
        print(root)
        self.__traverse_pre_order(root.left_child)
        self.__traverse_pre_order(root.right_child)

    def traverse_in_order(self) -> None:
        """
        An implementation of in-order traversal of a tree using recursion.
        """

        self.__traverse_in_order(self.__root)

    def __traverse_in_order(self, root: _Node) -> None:
        """
        The implementation detail of in-order traversal of a tree using recursion.

        :param root: is the current Node, or None if there are no more child nodes.
        """

        if root is None:
            return

        # Left, root, right
        self.__traverse_in_order(root.left_child)
        print(root)
        self.__traverse_in_order(root.right_child)

    def traverse_post_order(self) -> None:
        """
        An implementation of post-order traversal of a tree using recursion.
        """

        self.__traverse_post_order(self.__root)

    def __traverse_post_order(self, root: _Node) -> None:
        """
        The implementation detail of post-order traversal of a tree using recursion.

        :param root: is the current Node, or None if there are no more child nodes.
        """
        if root is None:
            return

        # Left, right, root
        self.__traverse_post_order(root.left_child)
        self.__traverse_post_order(root.right_child)
        print(root)

    def traverse_level_order(self):
        for i in range(self.height() + 1):
            for node in self.get_nodes_with_distance(i):
                print(node)
~~~
`

export default markdown