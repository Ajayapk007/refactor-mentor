export const SNIPPETS = [
  {
    label: "Bubble Sort",
    description: "O(n²) sorting — can Rex fix it?",
    code: `#include <iostream>
#include <vector>
using namespace std;

void bubbleSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
}

int main() {
    vector<int> arr = {64, 34, 25, 12, 22, 11, 90};
    bubbleSort(arr);
    for (int x : arr) cout << x << " ";
    return 0;
}`,
  },
  {
    label: "Two Sum (Brute Force)",
    description: "Nested loops — there's a better way",
    code: `#include <iostream>
#include <vector>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    int n = nums.size();
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            if (nums[i] + nums[j] == target) {
                return {i, j};
            }
        }
    }
    return {};
}

int main() {
    vector<int> nums = {2, 7, 11, 15};
    int target = 9;
    vector<int> result = twoSum(nums, target);
    cout << result[0] << ", " << result[1] << endl;
    return 0;
}`,
  },
  {
    label: "Raw Pointer Linked List",
    description: "Classic memory leak waiting to happen",
    code: `#include <iostream>
using namespace std;

struct Node {
    int data;
    Node* next;
    Node(int d) : data(d), next(nullptr) {}
};

class LinkedList {
public:
    Node* head;
    LinkedList() : head(nullptr) {}

    void push(int data) {
        Node* newNode = new Node(data);
        newNode->next = head;
        head = newNode;
    }

    void print() {
        Node* curr = head;
        while (curr) {
            cout << curr->data << " -> ";
            curr = curr->next;
        }
        cout << "NULL" << endl;
    }
    // No destructor — memory leak!
};

int main() {
    LinkedList list;
    list.push(1);
    list.push(2);
    list.push(3);
    list.print();
    return 0;
}`,
  },
  {
    label: "String Concatenation Loop",
    description: "O(n²) string building — a classic mistake",
    code: `#include <iostream>
#include <string>
#include <vector>
using namespace std;

string joinWords(vector<string>& words) {
    string result = "";
    for (int i = 0; i < words.size(); i++) {
        result = result + words[i];
        if (i < words.size() - 1) result = result + ", ";
    }
    return result;
}

int main() {
    vector<string> words = {"alpha", "beta", "gamma", "delta", "epsilon"};
    cout << joinWords(words) << endl;
    return 0;
}`,
  },
];