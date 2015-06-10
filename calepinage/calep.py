import math
import matplotlib.pyplot as plt
import numpy as np


class Piece(object):
    def __init__(self, pts):
        self.points = pts
        self.points_new_base = pts
        self.shift = Point(0, 0)
        self.theta = 0

    def __len__(self):
        return len(self.points)

    def move(self, shift, theta):
        self.points_new_base = [pt.add(shift) for pt in self.points]
        if theta != 0.0:
            origin = self.points_new_base[0]
            for pt in self.points_new_base[1:]:
                dx = pt.x - origin.x
                dy = pt.y - origin.y
                new_x =0
        self.theta = theta
        self.shift = shift

    def intersect(self, piece2, margin):
        for i in range(len(self)):
            pt1 = self.points_new_base[i]
            pt2 = self.points_new_base[(i+1)%(len(self))]
            for j in range(len(piece2)):
                pta = piece2.points_new_base[j]
                ptb = piece2.points_new_base[(j+1)%(len(piece2))]
                if intersect_segment(pt1, pt2, pta, ptb, margin):
                    return True
        return False

    def to_plot(self):
        x = np.zeros(len(self)+1)
        y = np.zeros(len(self)+1)
        for i, p in enumerate(self.points_new_base):
            x[i] = p.x
            y[i] = p.y
        x[len(self)] = x[0]
        y[len(self)] = y[0]
        return x, y



class Point(object):
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def dist(self, pt2):
        d = (self.y - pt2.y) ** 2 + (self.x - pt2.x) ** 2
        return math.sqrt(d)

    def add(self, pt2):
        p = Point(self.x + pt2.x, self.y + pt2.y)
        return p

    def sub(self, pt2):
        p = Point(self.x - pt2.x, self.y - pt2.y)
        return p


class Planche(object):
    def __init__(self, x, y):
        self.x = x
        self.y = y
        self.pieces = []

    def plot(self):
        plt.plot(np.array([0, 0, self.x, self.x, 0]), np.array([0, self.y, self.y, 0, 0]))
        for piece in self.pieces:
            x, y = piece.to_plot()
            plt.plot(x, y)
        plt.show()

def intersect_segment(pt1, pt2, pta, ptb, margin):
    #eq1 = pt1.x + k1 * (pt2.x - pt1.x) = pta.x + ka * (ptb.x - pta.x)
    #eq2 = pt1.y + k1 * (pt2.y - pt1.y) = pta.y + ka * (ptb.y - pta.y)
    #ax + by = c
    #dx + ey = f
    #a =
    return True

def main():
    piece_1 = Piece([Point(1,1), Point(2,2), Point(2,1)])
    piece_2 = Piece([Point(1,0), Point(0,2), Point(4,3)])
    piece_3 = Piece([Point(1,0), Point(0,2), Point(5,5), Point(4, 1), Point(3, 3)])
    tablo = Planche(10, 10)
    tablo.pieces = [piece_1, piece_2, piece_3]
    tablo.plot()

    piece_3.move(Point(4, 4), 54)
    tablo.plot()

if __name__ == "__main__":
    main()