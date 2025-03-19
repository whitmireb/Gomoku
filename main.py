from gomoku import Game
import random
import os
import neat
# import visualize

# game = Game(5)
# result = game.move(x, y)

def eval_genomes(genomes, config):
    for i in range(1, len(genomes), 2):
        genome_id1, genome1 = genomes[i]
        genome_id2, genome2 = genomes[i-1]
        n1 = neat.nn.FeedForwardNetwork.create(genome1, config)
        n2 = neat.nn.FeedForwardNetwork.create(genome2, config)
        genome1.fitness = genome1.fitness or 0
        genome2.fitness = genome2.fitness or 0
        inp = [random.randint(1, 10) for _ in range(361)]
        output1 = n1.activate(inp)
        output2 = n2.activate(inp)
        if output1[0] > output2[0]:
            genome1.fitness += 2*output1[0]
            genome2.fitness += output2[0]/2
        elif output2[0] > output1[0]:
            genome1.fitness += output1[0]/2
            genome2.fitness += 2*output2[0]
        else:
            genome1.fitness += 0
            genome2.fitness += 0

def run(config_file):
    # Load configuration.
    config = neat.Config(neat.DefaultGenome, neat.DefaultReproduction,
                         neat.DefaultSpeciesSet, neat.DefaultStagnation,
                         config_file)

    # Create the population, which is the top-level object for a NEAT run.
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
    config_path = os.path.join(local_dir, 'config')
    run(config_path)