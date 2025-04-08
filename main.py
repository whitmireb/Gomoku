from gomoku import Game
import random
import os
import neat
import argparse
# import visualize

parser = argparse.ArgumentParser(description="Run NEAT for Gomoku.")
parser.add_argument("--config", type=str, help="Path to NEAT config file", default="config")
parser.add_argument("-ch", "--checkpoint", type=str, help="Optional path to a NEAT checkpoint file to continue training", default=None)
parser.add_argument("--fight", action="store_true", help="Fight the winner of the provided checkpoint's generation")
# parser.add_argument("-cd", "--checkpointdir", type=str, help="Optional path to a the directory where the NEAT checkpoint files are stored, defualts to 'checkpoints'", default="checkpoints")
args = parser.parse_args()

min_board_size = 9
max_board_size = 19

def eval_genomes(genomes, config):
    # with open("watch.txt", "w") as f:
    for genome in genomes:
        genome.fitness = 0
    if len(genomes) % 2 == 1:
        genome_id, genome = genomes[-1]
        genome.fitness = 0
    for i in range(1, len(genomes), 2):
        genome_id1, genome1 = genomes[i-1]
        genome_id2, genome2 = genomes[i]
        n1 = neat.nn.FeedForwardNetwork.create(genome1, config)
        n2 = neat.nn.FeedForwardNetwork.create(genome2, config)
        board_size = 19     #random.randint(min_board_size, max_board_size)
        game = Game(board_size)
        turn = 0
        # print(f"player {i-1} and player {i} are fighting!", file=f)
        while True:
            x1, y1 = n1.activate(game.board)
            x1 = min(max(int(x1 * board_size), 0), board_size - 1)
            y1 = min(max(int(y1 * board_size), 0), board_size - 1)
            # print(f"turn {turn}, player {i-1} input: {game.board}", file=f)
            res = game.move(x1, y1)
            # print(f"turn {turn}, player {i-1}: result: {res}, x: {int(x1*19)}, y: {int(y1*19)}", file=f)
            if res > -1:
                # player 1 ended the game
                genome1.fitness = 1000 - (1000 - (res*200) + turn)
                game.current_player = 2
                res_2 = game.highestInRow()
                if res == 5:
                    genome2.fitness = turn + 150
                else:
                    genome2.fitness = turn - 150
                break

            x2, y2 = n2.activate(game.invertBoard())
            x2 = min(max(int(x2 * board_size), 0), board_size - 1)
            y2 = min(max(int(y2 * board_size), 0), board_size - 1)
            # print(f"turn {turn}, player {i} input: {game.invertBoard()}", file=f)
            res = game.move(x2, y2)
            # print(f"turn {turn}, player {i}: result: {res}, x: {int(x2*19)}, y: {int(y2*19)}", file=f)
            if res > -1:
                # player 2 ended the game
                genome2.fitness = 1000 - (1000 - (res*200) + turn)
                game.current_player = 1
                res_2 = game.highestInRow()
                if res == 5:
                    genome1.fitness = turn + 150
                else:
                    genome1.fitness = turn - 150
                break
            turn += 1
        turn = 0
        game = Game(board_size)
        while True:
            x2, y2 = n2.activate(game.board)
            x2 = min(max(int(x2 * board_size), 0), board_size - 1)
            y2 = min(max(int(y2 * board_size), 0), board_size - 1)
            # print(f"turn {turn}, player {i} input: {game.board}", file=f)
            res = game.move(x2, y2)
            # print(f"turn {turn}, player {i}: result: {res}, x: {int(x2*19)}, y: {int(y2*19)}", file=f)
            if res > -1:
                # player 1 ended the game
                genome2.fitness += 1000 - (1000 - (res*200) + turn)
                game.current_player = 1
                res_2 = game.highestInRow()
                if res == 5:
                    genome1.fitness += turn + 150
                else:
                    genome1.fitness += turn - 150
                break

            x1, y1 = n1.activate(game.invertBoard())
            x1 = min(max(int(x1 * board_size), 0), board_size - 1)
            y1 = min(max(int(y1 * board_size), 0), board_size - 1)
            # print(f"turn {turn}, player {i-1} input: {game.invertBoard()}", file=f)
            res = game.move(x1, y1)
            # print(f"turn {turn}, player {i-1}: result: {res}, x: {int(x1*19)}, y: {int(y1*19)}", file=f)
            if res > -1:
                # player 2 ended the game
                genome1.fitness += 1000 - (1000 - (res*200) + turn)
                game.current_player = 2
                res_2 = game.highestInRow()
                if res == 5:
                    genome2.fitness += turn + 150
                else:
                    genome2.fitness += turn - 150
                break
            turn += 1


def run(config_file, checkpoint=None):
    # Load configuration.
    config = neat.Config(neat.DefaultGenome, neat.DefaultReproduction,
                         neat.DefaultSpeciesSet, neat.DefaultStagnation,
                         config_file)
    
    # Create the population, which is the top-level object for a NEAT run.
    
    if checkpoint and os.path.exists(checkpoint):
        print(f"Loading checkpoint: {checkpoint}")
        p = neat.Checkpointer.restore_checkpoint(checkpoint)
    else:
        # Create a new population
        p = neat.Population(config)

    # Add a stdout reporter to show progress in the terminal.
    p.add_reporter(neat.StdOutReporter(True))
    stats = neat.StatisticsReporter()
    p.add_reporter(stats)
    checkpointer = neat.Checkpointer(5)
    p.add_reporter(checkpointer)

    # Run for up to 300 generations.
    winner = p.run(eval_genomes, 10000)

    # Display the winning genome.
    print(f"We got a winner! with a fitness value of {winner.fitness}!")

    print("Saving final checkpoint...")
    checkpointer.save_checkpoint(p.config, p.population, p.species, p.generation)
    print("Checkpoint saved successfully.")

def play(config_file, checkpoint):
    '''Allows you to play against the best member of the provided generation'''
    # Load configuration.
    config = neat.Config(neat.DefaultGenome, neat.DefaultReproduction,
                         neat.DefaultSpeciesSet, neat.DefaultStagnation,
                         config_file)
    
    # Create the population, which is the top-level object for a NEAT run.
    print(f"Loading checkpoint: {checkpoint}")
    p = neat.Checkpointer.restore_checkpoint(checkpoint)

    valid_genomes = [g for g in p.population.values() if g.fitness is not None]
    best_genome = max(valid_genomes, key=lambda g: g.fitness)

    print(f"The best player in this generation has a fitness of {best_genome.fitness}")
    print("It's ROBOT FIGHTIN' TIME!!!")
    n1 = neat.nn.FeedForwardNetwork.create(best_genome, config)
    board_size = 19
    game = Game(board_size)
    while True:
        print("Your move!")
        x, y = input().split()
        res = game.move(int(x), int(y))
        print(game)
        if res > -1:
            if res == 5:
                print("You WIN!!!")
            else:
                print(f"You Lose! you had {res} in a row!")
            break
            
        print("AI's move")
        x, y = n1.activate(game.board)
        x = min(max(int(x * board_size), 0), board_size - 1)
        y = min(max(int(y * board_size), 0), board_size - 1)
        res = game.move(x, y)
        print(f"X: {x}, Y: {y}")
        print(game)
        if res > -1:
            if res == 5:
                print("The AI WON!!!")
            else:
                print(f"The AI lost! it had {res} in a row!")
            break



if __name__ == '__main__':
    local_dir = os.path.dirname(__file__)
    config_path = os.path.join(local_dir, args.config)
    # os.makedirs(args.checkpointdir, exist_ok=True)
    if args.fight:
        play(config_path, args.checkpoint)
    else:
        run(config_path, args.checkpoint)