import random, debug
numbers = {"1": [], "2": [], "3": [], "4": [], "5": [], "6": [], "7": [], "8": [], "9": []}
ALL_X_COORDS = (1, 2, 3, 4, 5, 6, 7, 8, 9)
ALL_Y_COORDS = (1, 2, 3, 4, 5, 6, 7, 8, 9)
ALL_SQUARES = ( # tuples containing two coordinate pairs
    ((1, 1), (3, 3)), ((4, 1), (6, 3)), ((7, 1), (9, 3)),
    ((1, 4), (3, 6)), ((4, 4), (6, 6)), ((7, 4), (9, 6)),
    ((1, 7), (3, 9)), ((4, 7), (6, 9)), ((7, 7), (9, 9))
)

# logic
def get_possible_coords(taken_coords, possible_x_coords = list(ALL_X_COORDS), possible_y_coords = list(ALL_Y_COORDS)):
    """
    :param taken_coords: list of tuples containing x and y coordinate values
    :param possible_x_coords: Optional list of all coordinates available
    :param possible_y_coords: Optional list of all coordinates available
    :return tuple: Tuple containing possible x and y coordinates
    """
    for coords in taken_coords:
        if coords[0] in possible_x_coords:
            possible_x_coords.remove(coords[0])
        if coords[1] in possible_y_coords:
            possible_y_coords.remove(coords[1])
    return possible_x_coords, possible_y_coords

def build_coords_map(x_coords, y_coords):
    """
    :param x_coords: Iterable containing integer values representing x coordinates.
    :param y_coords: Iterable containing integer values representing y coordinates.
    :return outlist: List containing tuples with xy value pairs.
    """
    outlist = []
    for x in x_coords:
        for y in y_coords:
            outlist.append((x, y))
    return outlist

is_in_square = lambda coords, square: coords[0] >= square[0][0] and coords[0] <= square[1][0] and coords[1] >= square[0][1] and coords[1] <= square[1][1]

def remove_coords_within_square(coords_taken, coords_map, squares):
    """
    :param coords_taken: Iterable of tuples containing xy values.
    :param coords_map: Iterable of tuples containing xy values.
    :param squares: Iterable containing two tuples containing xy values that serve as bounding boxes of a square.
    :return outlist: List of tuples containing xy values that do not share squares with `coords_taken`
    """
    outlist = coords_map.copy() 
    if len(coords_taken) == 0: 
        return outlist
    for square in squares:
        for coord in coords_taken:
            if is_in_square(coord, square):
                outlist = [c for c in outlist if not is_in_square(c, square)]
    return outlist

""" Place one number
number, number_coords = random.choice(list(numbers.items()))
while len(number_coords) < 9:
    coords_map = build_coords_map(*get_possible_coords(number_coords))
    final_coords_map = remove_coords_within_square(number_coords, coords_map, ALL_SQUARES)
    choice = random.choice(final_coords_map)
    number_coords.append(choice)
debug.display_grid(number_coords)
"""

for number in sorted(numbers):
    print(number)
    #



