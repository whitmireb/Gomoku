from gomoku import Game
import random
import os
import neat
import argparse
# import visualize

parser = argparse.ArgumentParser(description="Run NEAT for Gomoku.")
parser.add_argument("--config", type=str, help="Path to NEAT config file", default="config")
parser.add_argument("-ch", "--checkpoint", type=str, help="Optional path to a NEAT checkpoint file to continue training", default=None)
# parser.add_argument("-cd", "--checkpointdir", type=str, help="Optional path to a the directory where the NEAT checkpoint files are stored, defualts to 'checkpoints'", default="checkpoints")
args = parser.parse_args()

min_board_size = 9
max_board_size = 19

def eval_genomes(genomes, config):
    # with open("watch.txt", "w") as f:
    if len(genomes) % 2 == 1:
        genome_id, genome = genomes[-1]
        genome.fitness = 0
    for i in range(1, len(genomes), 2):
        genome_id1, genome1 = genomes[i-1]
        genome_id2, genome2 = genomes[i]
        n1 = neat.nn.FeedForwardNetwork.create(genome1, config)
        n2 = neat.nn.FeedForwardNetwork.create(genome2, config)
        genome1.fitness = genome1.fitness or 0
        genome2.fitness = genome2.fitness or 0
        board_size = random.randint(min_board_size, max_board_size)
        game = Game(board_size)
        turn = 0
        # print(f"player {i-1} and player {i} are fighting!", file=f)
        while True:
            x1, y1 = n1.activate(game.board)
            res = game.move(int(x1*19), int(y1*19))
            # print(f"turn {turn}, player {i-1}: result: {res}, x: {int(x1*19)}, y: {int(y1*19)}", file=f)
            if res > -1:
                # player 1 ended the game
                genome1.fitness = 1000 - (1000 - (res*200) + turn)
                game.current_player = 2
                res_2 = game.highestInRow()
                if res == 5:
                    genome2.fitness = 1000 - (1000 - (res_2*200) + turn + 150)
                else:
                    genome2.fitness = 1000 - (1000 - (res_2*200) + turn - 150)
                break

            x2, y2 = n2.activate(game.invertBoard())
            res = game.move(int(x2*19), int(y2*19))
            # print(f"turn {turn}, player {i}: result: {res}, x: {int(x2*19)}, y: {int(y2*19)}", file=f)
            if res > -1:
                # player 2 ended the game
                genome2.fitness = 1000 - (1000 - (res*200) + turn)
                game.current_player = 1
                res_2 = game.highestInRow()
                if res == 5:
                    genome1.fitness = 1000 - (1000 - (res_2*200) + turn + 150)
                else:
                    genome1.fitness = 1000 - (1000 - (res_2*200) + turn - 150)
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
    p.add_reporter(neat.Checkpointer(5))

    # Run for up to 300 generations.
    winner = p.run(eval_genomes, 300)

    # Display the winning genome.
    print('\nBest genome:\n{!s}'.format(winner))


if __name__ == '__main__':
    local_dir = os.path.dirname(__file__)
    config_path = os.path.join(local_dir, args.config)
    # os.makedirs(args.checkpointdir, exist_ok=True)
    run(config_path, args.checkpoint)