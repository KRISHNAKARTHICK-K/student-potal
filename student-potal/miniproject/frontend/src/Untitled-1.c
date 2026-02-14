#include <stdio.h>
#include <stdlib.h>

#define THRESHOLD 10
int sortOrder = 1;

int compare(int a, int b) {
    if (sortOrder == 1)
        return a - b;
    else
        return b - a;
}

void insertionSort(int arr[], int left, int right) {
    int i, j, key;
    for (i = left + 1; i <= right; i++) {
        key = arr[i];
        j = i - 1;
        while (j >= left && compare(arr[j], key) > 0) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}

int partition(int arr[], int low, int high) {
    int pivot = arr[(low + high) / 2];
    int i = low;
    int j = high;
    int temp;

    while (i <= j) {
        while (compare(arr[i], pivot) < 0)
            i++;
        while (compare(arr[j], pivot) > 0)
            j--;
        if (i <= j) {
            temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
            i++;
            j--;
        }
    }
    return i;
}

void customSort(int arr[], int low, int high) {
    if (low < high) {
        if (high - low + 1 <= THRESHOLD) {
            insertionSort(arr, low, high);
        } else {
            int index = partition(arr, low, high);
            if (low < index - 1)
                customSort(arr, low, index - 1);
            if (index < high)
                customSort(arr, index, high);
        }
    }
}

void displayArray(int arr[], int n) {
    for (int i = 0; i < n; i++)
        printf("%d ", arr[i]);
    printf("\n");
}

int main() {
    int arr[100], n;

    printf("============================================\n");
    printf("         CUSTOM SORTING ALGORITHM (C)       \n");
    printf("============================================\n");
    printf("Enter number of elements: ");
    scanf("%d", &n);

    printf("Enter %d integers:\n", n);
    for (int i = 0; i < n; i++) {
        scanf("%d", &arr[i]);
    }

    while (1) {
        printf("\nSelect Sorting Order:\n");
        printf("1. Ascending Order\n");
        printf("2. Descending Order\n");
        printf("Enter your choice: ");
        scanf("%d", &sortOrder);

        printf("\nUnsorted Array:\n");
        displayArray(arr, n);

        customSort(arr, 0, n - 1);

        printf("\nSorted Array (%s):\n", (sortOrder == 1) ? "Ascending" : "Descending");
        displayArray(arr, n);

        printf("\nSorting completed successfully!\n");
        printf("============================================\n");
    }

    return 0;
}