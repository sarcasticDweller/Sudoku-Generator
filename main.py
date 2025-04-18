import random
numbers = {"ones": [], "twos": [], "threes": [], "fours": [], "fives": [], "sixes": [], "sevens": [], "eights": [], "nines": []}
ALL_X_COORDS = (1, 2, 3, 4, 5, 6, 7, 8, 9)
ALL_Y_COORDS = (1, 2, 3, 4, 5, 6, 7, 8, 9)
ALL_SQUARES = ( # tuples containing two coordinate pairs
    ((1, 1), (3, 3)), ((1, 4), (3, 6)), ((1, 7), (3, 9)),
    ((3, 1), (6, 3)), ((3, 4), (6, 6)), ((3, 7), (6, 9)),
    ((6, 1), (9, 3)), ((6, 4), (9, 6)), ((6, 7), (9, 9))
)

# logic
def get_possible_coords(taken_coords, possible_x_coords = list(ALL_X_COORDS), possible_y_coords = list(ALL_Y_COORDS)):
    """
    :param taken_coords: list of tuples containing x and y coordinate values
    :param possible_x_coords: Optional list of all coordinates available
    :param possible_y_coords: Optional list of all coordinates available
    :return tuple: Lists containing possible x and y coordinates
    """
    for coords in taken_coords:
        if coords[0] in possible_x_coords:
            possible_x_coords.remove(coords[0])
        if coords[1] in possible_y_coords:
            possible_y_coords.remove(coords[1])
    return possible_x_coords, possible_y_coords

def build_coords_map(x_coords, y_coords):
    outlist = []
    for x in x_coords:
        for y in y_coords:
            outlist.append((x, y))
    return outlist

#is_in_square = lambda coords, square: coords[0] >= square[0][0] and coords[0] <= square[1][0] and coords[1] >= square[0][1] and coords[1] <= square[1][1]
# a collider basically
def is_in_square(coords, square):
    """
    :param coords: Iterable containing two integer values, representing x and y coordinates.
    :param square: Tuple containing two tuples, each holding an x and y value. The first tuple `square[0]` contains the low bounding corner and the second tuple `square[1]` contains the high bounding corner.
    :return boolean: `True` if `coords` are within the bounds of `square`, `False` otherwise.
    """
    x, y = coords[0], coords[1]
    low_x = square[0][0]
    high_x = square[1][0]
    low_y = square[0][1]
    high_y = square[1][1]
    return x >= low_x and x <= high_x and y >= low_y and y <= high_y


def remove_coords_within_zone(coords, zone):
    outlist = coords.copy()
    for coord in coords:
        if is_in_square(coord, zone):
            print("is in square")
            outlist.remove(coord)
    return outlist
number, num_coords = random.choice(list(numbers.items()))
#num_coords.append((1, 2)) # test line
while len(num_coords) < 9:
    print("starting loop")
    print(f"current num coords: {num_coords}")
    possible_coords = get_possible_coords(num_coords)
    print(f"possible coords: {possible_coords}")
    coords_map = build_coords_map(*possible_coords)
    print(f"coords map: {coords_map}")
    final_coords_map = remove_coords_within_zone(coords_map, ALL_SQUARES[0])
    print(f"final coords map: {final_coords_map}")
    choice = random.choice(final_coords_map)
    print(f"picked coordinate: {choice}")
    num_coords.append(choice)
print(f"{number}: {num_coords}")
# remove coords from coords_map that are in squares with the same number


