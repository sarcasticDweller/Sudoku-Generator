import random, debug
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

is_in_square = lambda coords, square: coords[0] >= square[0][0] and coords[0] <= square[1][0] and coords[1] >= square[0][1] and coords[1] <= square[1][1]

def remove_coords_within_zone(coords_taken, coords_map, zone):
    outlist = coords_map.copy()
    if len(coords_taken) == 0:
        return outlist # exit case
    for coord in coords_taken:
        if is_in_square(coord, zone):
            # remove all coordinates in that square from the outlist
            for c in outlist:
                if is_in_square(c, zone):
                    outlist.remove(c)
    return outlist

number, num_coords = random.choice(list(numbers.items()))
while len(num_coords) < 9:
    coords_map = build_coords_map(*get_possible_coords(num_coords))
    final_coords_map = remove_coords_within_zone(num_coords, coords_map, ALL_SQUARES[0])
    #print(final_coords_map)
    choice = random.choice(final_coords_map)
    num_coords.append(choice)


# Example usage
debug.display_grid(num_coords)


