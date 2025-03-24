
class Game:
    def __init__(self, size, max_board_size = 19):
        self.size = size
        self.current_player = 1
        self.max_board_size = max_board_size
        self.board = [0 if k//self.max_board_size < self.size and k % self.max_board_size < self.size else -1 for k in range(self.max_board_size*self.max_board_size)]
        self.highest_score = [0, 0]

    def highestInRow(self):
        highest = 0
        for i in range(self.size):
            hcount = 0
            vcount = 0
            for j in range(self.size):
                if self.board[i*self.max_board_size + j] == self.current_player:
                    hcount += 1
                    if hcount > highest: highest = hcount
                    if hcount > 4:
                        return 5
                else:
                    hcount = 0

                if self.board[j*self.max_board_size + i] == self.current_player:
                    vcount += 1
                    if vcount > highest: highest = vcount
                    if vcount > 4:
                        return 5
                else:
                    vcount = 0

        for i in range(self.size - 4):
            ucount = 0
            dcount = 0
            for j in range(self.size - i):
                if self.board[(i+j)*self.max_board_size + j] == self.current_player:
                    dcount += 1
                    if dcount > highest: highest = dcount
                    if dcount > 4:
                        return 5
                else:
                    dcount = 0

                if self.board[j*self.max_board_size + (j+i)] == self.current_player:
                    ucount += 1
                    if ucount > highest: highest = ucount
                    if ucount > 4:
                        return 5
                else:
                    ucount = 0

            ucount = 0
            dcount = 0
            for j in range(self.size - i):
                if self.board[(i+j)*self.max_board_size + (self.size-j-1)] == self.current_player:
                    dcount += 1
                    if dcount > highest: highest = dcount
                    if dcount > 4:
                        return 5
                else:
                    dcount = 0
                
                if self.board[j*self.max_board_size + (self.size-i-j-1)] == self.current_player:
                    ucount += 1
                    if ucount > highest: highest = ucount
                    if ucount > 4:
                        return 5
                else:
                    ucount = 0
        return highest

    def move(self, x, y):
        if x > self.size-1 or y > self.size-1 or x < 0 or y < 0 or self.board[x*self.max_board_size + y] != 0:
            return self.highest_score[self.current_player-1]
        else:
            self.board[x*self.max_board_size + y] = self.current_player
            won = self.highestInRow()
            if won == 5:
                return 5
            self.highest_score[self.current_player-1] = won
            self.current_player = (2 - self.current_player) + 1
        return -1
    
    def invertBoard(self):
        new_board = [0]*len(self.board)
        for i in range(len(self.board)):
            if self.board[i] == 1:
                new_board[i] = 2
            elif self.board[i] == 2:
                new_board[i] = 1
            else:
                new_board[i] = self.board[i]
        return new_board
    
    def __str__(self):
        s = ""
        for i in range(self.size):
            s += str(self.board[i*self.max_board_size : (i+1)*self.max_board_size]) + '\n'
        return s