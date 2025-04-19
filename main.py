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
def get_possible_coords(taken_coords, x_coords = ALL_X_COORDS, y_coords = ALL_Y_COORDS):
    """
    :param taken_coords: list of tuples containing x and y coordinate values
    :param x_coords: Optional list of all coordinates available
    :param y_coords: Optional list of all coordinates available
    :return tuple: Tuple containing possible x and y coordinates
    """
    possible_x_coords = list(x_coords).copy()
    possible_y_coords = list(y_coords).copy()
    if len(taken_coords) != 0:
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

def remove_coords_within_square(taken_coords, coords_map, squares):
    """
    :param taken_coords: Iterable of tuples containing xy values.
    :param coords_map: Iterable of tuples containing xy values.
    :param squares: Iterable containing two tuples containing xy values that serve as bounding boxes of a square.
    :return outlist: List of tuples containing xy values that do not share squares with `taken_coords`
    """
    outlist = coords_map.copy() 
    if len(taken_coords) == 0: 
        return outlist
    for square in squares:
        for coord in taken_coords:
            if is_in_square(coord, square):
                outlist = [c for c in outlist if not is_in_square(c, square)]
    return outlist

get_all_numbers = lambda numbers: [coord for number in sorted(numbers) for coord in numbers[number]]

remove_coords_from_map = lambda coords, map: [c for c in map if c not in coords]


for number in sorted(numbers):
    print(f"////////////\nWorking number is {number}")
    coords = numbers[number]
    print(f"Initializing with coords: {coords}")
    tried_coords = set()

    while len(coords) < 9:
        coords_map = build_coords_map(*get_possible_coords(coords))
        all_placed_numbers = get_all_numbers(numbers)
        #print(f"Placed numbers: {all_placed_numbers}")
        print(f"Coords map: {coords_map}")
        cleaned_coords_map = remove_coords_from_map(all_placed_numbers, coords_map)
        print(f"Cleaned coords map: {cleaned_coords_map}")
        square_aware_coords_map = remove_coords_within_square(coords, cleaned_coords_map, ALL_SQUARES)

        tried_coords_aware_coords_map = remove_coords_from_map(tried_coords, square_aware_coords_map)
        print(f"Tried coords aware map: {tried_coords_aware_coords_map}")

        if len(tried_coords_aware_coords_map) == 0:
            if len(coords) == 0:
                print("fuck!")
                break
            # find the coord thats conflicting and remove it
            number_want_to_place = cleaned_coords_map[0] if len(cleaned_coords_map) == 1 else coords_map[0] # must only have one item left
            conflicting_coord = None
            for c in coords:
                if c[0] == number_want_to_place[0] or c[1] == number_want_to_place[1]:
                    conflicting_coord = c
                    break # we found it boys
            if conflicting_coord == None:
                conflicting_coord = coords[0] # a hail mary
            last_coord = coords.remove(conflicting_coord)
            tried_coords.add(last_coord)
            print(f"Backtracking from {last_coord}")
            continue
        choice = random.choice(tried_coords_aware_coords_map)
        coords.append(choice)
        tried_coords.clear()
        debug.display_grid(numbers)
