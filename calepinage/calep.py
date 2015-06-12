import math
import matplotlib.pyplot as plt
import numpy as np


class Piece(object):
    def __init__(self, pts):
        self.points = pts
        self.points_new_base = pts
        self.segments = [pt.sub(pts[0]) for pt in pts]
        self.distance = [s.size() for s in self.segments]
        self.angle_base = [s.angle() for s in self.segments]
        self.shift = Point(0, 0)
        self.theta = 0
        self.x_min = 0
        self.x_max = 0
        self.y_min = 0
        self.y_max = 0

    def compute_min_max(self):
        self.x_min = min([pt.x for pt in self.points_new_base])
        self.x_max = max([pt.x for pt in self.points_new_base])
        self.y_min = min([pt.y for pt in self.points_new_base])
        self.y_max = max([pt.y for pt in self.points_new_base])

    def __len__(self):
        return len(self.points)

    def move(self, shift, theta):
        self.points_new_base = [pt.rotate(theta) for pt in self.segments]
        shift = shift.add(self.points[0])
        self.points_new_base = [pt.add(shift) for pt in self.points_new_base]
        self.theta = theta
        self.shift = shift
        self.compute_min_max()

    def intersect(self, piece2, margin):
        if not intersect_box(self.x_min, self.x_max, self.y_min, self.y_max, piece2.x_min, piece2.x_max, piece2.y_min, piece2.y_max):
            return False
        for i in range(len(self)):
            pt1 = self.points_new_base[i]
            pt2 = self.points_new_base[(i+1)%(len(self))]
            for j in range(len(piece2)):
                pta = piece2.points_new_base[j]
                ptb = piece2.points_new_base[(j+1)%(len(piece2))]
                if intersect_segment(pt1, pt2, pta, ptb, margin):
                    return True
        return False

    def is_in_tableau(self, x, y):
        for pt in self.points_new_base:
            if not pt.is_in_tableau(x, y):
                return False
        return True

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

    def size(self):
        return math.sqrt(self.x ** 2 + self.y ** 2)

    def dist(self, pt2):
        d = (self.y - pt2.y) ** 2 + (self.x - pt2.x) ** 2
        return math.sqrt(d)

    def add(self, pt2):
        p = Point(self.x + pt2.x, self.y + pt2.y)
        return p

    def sub(self, pt2):
        p = Point(self.x - pt2.x, self.y - pt2.y)
        return p

    def angle(self):
        if self.y == 0:
            if self.x < 0:
                return math.pi
            else:
                return 0
        t = self.y / (self.x + self.size())
        angle = 2 * math.atan(t)
        return angle

    def rotate(self, theta):
        angle = self.angle()
        new_angle = angle + theta
        d = self.size()
        new_pt = Point(d * math.cos(new_angle), d * math.sin(new_angle))
        return new_pt

    def is_in_tableau(self, x, y):
        return 0 <= self.x <= x and 0 <= self.y <= y

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

    def is_piece_ok(self, ind_piece):
        p = self.piece[ind_piece]
        if not p.is_in_tableau(self.x, self.y):
            return False
        for j in range(len(self.pieces)):
            if i != j:
                if p.intersect(self.pieces[j], 0):
                    return False
        return True
        
    def is_ok(self, margin):
        for p in self.pieces:
            if not p.is_in_tableau(self.x, self.y):
                return False
        for i in range(len(self.pieces)):
            for j in range(i + 1, len(self.pieces)):
                if self.pieces[i].intersect(self.pieces[j], margin):
                    return False
        return True

    def place_piece(self, dx, dy, dt, ind_piece):
        piece = self.pieces[ind_piece]
        x = 0
        while x < self.x:
            y = 0
            while y < self.y:
                t = 0
                while t < 2*math.pi:
                    shift = Point(x, y)
                    piece.move(shift, t)
                    if self.is_piece_ok(ind_piece):
                        self.plot()
                        #return True
                    t += dt
                y += dy
            x += dx
        return False

def intersect_segment(pt1, pt2, pta, ptb, margin):
    #eq1 = pt1.x + k1 * (pt2.x - pt1.x) = pta.x + ka * (ptb.x - pta.x)
    #eq2 = pt1.y + k1 * (pt2.y - pt1.y) = pta.y + ka * (ptb.y - pta.y)
    a = pt2.x - pt1.x
    b = - (ptb.x - pta.x)
    c = pta.x - pt1.x
    d = pt2.y - pt1.y
    e = - (ptb.y - pta.y)
    f = pta.y - pt1.y
    m = np.array([[a, b], [d, e]])
    v = np.array([c, f])
    u = np.linalg.lstsq(m, v)[0]
    k1, ka = u
    diff  = np.dot(m, u) - v
    norm = diff[0] ** 2 + diff[1] ** 2
    if norm < 0.01 and 0 <= k1 <= 1 and 0 <= ka <= 1:
        return True
    return False

def intersect_box(x_min, x_max, y_min, y_max, x_min1, x_max1, y_min1, y_max1):
    return intersect_segment_1d(x_min, x_max, x_min1, x_max1) and intersect_segment_1d(y_min, y_max, y_min1, y_max1)
    
def intersect_segment_1d(x_min, x_max, x_min1, x_max1):
    return x_min <= x_min1 <= x_max or x_min <= x_max1 <= x_max
    
def main():
    piece_1 = Piece([Point(1,1), Point(2,2), Point(2,1)])
    piece_2 = Piece([Point(1,0), Point(0,2), Point(4,3), Point(6,0)])
    piece_3 = Piece([Point(1,0), Point(0,2), Point(5,5), Point(4, 1), Point(3, 3)])
    piece_4 = Piece([Point(0,0), Point(2,0), Point(2,2), Point(0,2)])
    tablo = Planche(10, 10)
    tablo.pieces = [piece_1, piece_2, piece_3]
    piece_3.move(Point(8,9), math.pi)
    piece_1.move(Point(1,3), 0)
    piece_2.move(Point(0.5, 0.5), 0)
    piece_4.move(Point(0.5, 0.5), 0)
    print(tablo.is_ok(0))
    tablo.plot()

    print(tablo.place_piece(1, 1 , math.pi / 10.0, piece_4))
    tablo.plot()


if __name__ == "__main__":
    main()
