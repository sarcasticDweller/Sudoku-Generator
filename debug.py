def display_grid(numbers):
    """
    Displays a 2D grid (1-9) with the numbers from numbers placed at their respective coordinates,
    formatted with bounding boxes like a Sudoku board.

    :param numbers: Dictionary where keys are numbers (as strings) and values are lists of (x, y) tuples.
    """
    grid = [["." for _ in range(9)] for _ in range(9)]  # Create a 9x9 grid filled with dots

    # Place numbers on the grid
    for number, coords in numbers.items():
        for x, y in coords:
            grid[y - 1][x - 1] = number  # Place the number at the correct position

    # Print the grid with Sudoku formatting
    print("   1 2 3   4 5 6   7 8 9")  # Print column headers with spacing for boxes
    print("  +-------+-------+-------+")  # Top border
    for i, row in enumerate(grid):
        row_str = f"{i + 1} | "  # Add row number and left border
        for j, cell in enumerate(row):
            row_str += cell + " "
            if (j + 1) % 3 == 0:  # Add vertical box borders
                row_str += "| "
        print(row_str)
        if (i + 1) % 3 == 0:  # Add horizontal box borders
            print("  +-------+-------+-------+")