
def display_grid(num_coords): # full disclaimer, i didnt write this. i made the ai make debugging tools for me
    """
    Displays a 2D grid (1-9) with the coordinates from num_coords marked,
    formatted with bounding boxes like a Sudoku board.
    :param num_coords: List of tuples containing x and y coordinates.
    """
    grid = [["." for _ in range(9)] for _ in range(9)]  # Create a 9x9 grid filled with dots
    for x, y in num_coords:
        grid[y - 1][x - 1] = "X"  # Mark the coordinate with 'X'

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