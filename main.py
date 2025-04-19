import random, debug 
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


def generate_board():
    numbers = {"1": [], "2": [], "3": [], "4": [], "5": [], "6": [], "7": [], "8": [], "9": []}
    cycles = 0
    for number in sorted(numbers):
        coords = numbers[number]
        tried_coords = set()

        while len(coords) < 9:
            if cycles == 200:
                return None, cycles # Give up

            cycles += 1
            coords_map = build_coords_map(*get_possible_coords(coords))
            all_placed_numbers = get_all_numbers(numbers)
            cleaned_coords_map = remove_coords_from_map(all_placed_numbers, coords_map)
            square_aware_coords_map = remove_coords_within_square(coords, cleaned_coords_map, ALL_SQUARES)

            tried_coords_aware_coords_map = remove_coords_from_map(tried_coords, square_aware_coords_map)

            if len(tried_coords_aware_coords_map) == 0:
                if not coords: # equal to `if len(coords) == 0`. thank you @Snorlax666 on discord
                    break # honesty i dont actually remember what this does
                # find the coord thats conflicting and remove it
                number_want_to_place = cleaned_coords_map[0] if len(cleaned_coords_map) == 1 else coords_map[0] # must only have one item left
                conflicting_coord = None
                for c in coords:
                    if c[0] == number_want_to_place[0] or c[1] == number_want_to_place[1]:
                        conflicting_coord = c
                        break # we found it boys
                if conflicting_coord == None:
                    conflicting_coord = coords[0] # a hail mary
                coords.remove(conflicting_coord)
                tried_coords.add(conflicting_coord)
                continue

            choice = random.choice(tried_coords_aware_coords_map)
            coords.append(choice)
            tried_coords.clear()
    return numbers, cycles

def hide_numbers_on_board(board, amount):
    """
    :param board: Iterable of tuples containing xy values
    :param amount: Integer representing amount of numbers to be hidden
    :return: Iterable of tuples containing xy values that is `amount` tuples shorter than `board`.
    """
    trimmed_board = board.copy()
    counter = amount
    while counter != 0:
        number_to_remove = random.choice(list(trimmed_board.items()))
        trimmed_board[number_to_remove[0]].remove(random.choice(number_to_remove[1]))
        counter -= 1
    return trimmed_board


attempts = 0
while True:
    attempts += 1
    numbers, cycles = generate_board()
    if numbers != None:
        break

cells_to_hide = 40
print("Full Board")
print("===========")
debug.display_grid(numbers)
print(f"Board made in {cycles} cycles and {attempts} attempts")
print(f"\nBoard with {cells_to_hide} cells hidden")
print("===========================================")
debug.display_grid(hide_numbers_on_board(numbers, cells_to_hide))