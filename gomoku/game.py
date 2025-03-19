
class Game:
    def __init__(self, size):
        self.size = size
        self.current_player = 0
        self.board = [[" "]*self.size for _ in range(self.size)]

    def hasWon(self):
        for i in range(self.size):
            hcount = 0
            vcount = 0
            for j in range(self.size):
                if self.board[i][j] == self.current_player:
                    hcount += 1
                    if hcount > 4:
                        return True
                else:
                    hcount = 0

                if self.board[j][i] == self.current_player:
                    vcount += 1
                    if vcount > 4:
                        return True
                else:
                    vcount = 0

        for i in range(self.size - 4):
            ucount = 0
            dcount = 0
            for j in range(self.size - i):
                if self.board[i+j][j] == self.current_player:
                    dcount += 1
                    if dcount > 4:
                        return True
                else:
                    dcount = 0

                if self.board[j][i+j] == self.current_player:
                    ucount += 1
                    if ucount > 4:
                        return True
                else:
                    ucount = 0

            ucount = 0
            dcount = 0
            for j in range(self.size - i):
                if self.board[i+j][self.size-j-1] == self.current_player:
                    dcount += 1
                    if dcount > 4:
                        return True
                else:
                    dcount = 0
                
                if self.board[j][self.size-i-j-1] == self.current_player:
                    ucount += 1
                    if ucount > 4:
                        return True
                else:
                    ucount = 0
        return False

    def move(self, x, y):
        if x > self.size-1 or y > self.size-1 or x < 0 or y < 0 or self.board[x][y] != " ":
            return -1
        else:
            self.board[x][y] = self.current_player
            won = self.hasWon()
            self.current_player = 1 - self.current_player
            if won:
                return 1
        return 0
    
    def __str__(self):
        s = ""
        for i in range(self.size):
            s += str(self.board[i]) + '\n'
        return s