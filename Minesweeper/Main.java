package Minesweeper;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;

public class Main {

    public static class Node {
        Node t = null;
        Node b = null;
        Node l = null;
        Node r = null;
        Node rb = null;
        Node rt = null;
        Node lb = null;
        Node lt = null;
        char symbol = '.';
        boolean beenHere = false;
        int num = 0;

        public Node(char value) {
            this.symbol = value;
        }

        public void L(Node node) {
            this.l = node;
        }

        public void R(Node node) {
            this.r = node;
        }

        public void T(Node node) {
            this.t = node;
        }

        public void B(Node node) {
            this.b = node;
        }

        public void RB(Node node) {
            this.rb = node;
        }

        public void RT(Node node) {
            this.rt = node;
        }

        public void LB(Node node) {
            this.lb = node;
        }

        public void LT(Node node) {
            this.lt = node;
        }
    }

    private static Node[][] GetLinkedList(char[][] arr) {
        Node[][] map = new Node[arr.length][arr[0].length];
        for (int r = 0; r < map.length; r++) {
            for (int c = 0; c < map[r].length; c++) {
                map[r][c] = new Node(arr[r][c]);
            }
        }
        for (int r = 0; r < map.length; r++) {
            for (int c = 0; c < map[r].length; c++) {
                if(c > 0){
                    //left
                    map[r][c].l = map[r][c-1];
                    map[r][c-1].r = map[r][c]; //inverse
                    if(r > 0){
                        //top, top left
                        map[r][c].t = map[r-1][c];
                        map[r][c].lt = map[r-1][c-1];
                        map[r-1][c].b = map[r][c]; //inverse
                        map[r-1][c-1].rb = map[r][c]; //inverse
                    }
                }
                if(c < map[r].length - 1){
                    //right
                    map[r][c].r = map[r][c+1];
                    map[r][c+1].l = map[r][c]; //inverse
                    if(r < map.length - 1){
                        //bottom, right bottom
                        map[r][c].b = map[r+1][c];
                        map[r][c].rb = map[r+1][c+1];
                        map[r+1][c].t = map[r][c]; //inverse
                        map[r+1][c+1].lt = map[r][c]; //inverse
                    }
                    if(r > 0){
                        //right top
                        map[r][c].rt = map[r-1][c+1];
                        map[r-1][c+1].lb = map[r][c];//inverse
                    }
                }
            }
        }
        return map;
    }

    private static Node[][] solve(char[][] area) {
        Node[][] map = GetLinkedList(area);
        SumMines(map[0][0]);
        return map;
    }

    private static void SumMines(Node node){
        node.beenHere = true;
        if(node.l != null){
            if(node.l.symbol == '*'){
                node.num++;
            }else{
                if(!node.l.beenHere){
                    SumMines(node.l);
                }
            }
        }
        if(node.lt != null){
            if(node.lt.symbol == '*'){
                node.num++;
            }else{
                if(!node.lt.beenHere){
                    SumMines(node.lt);
                }
            }
        }
        if(node.t != null){
            if(node.t.symbol == '*'){
                node.num++;
            }else{
                if(!node.t.beenHere){
                    SumMines(node.t);
                }
            }
        }
        if(node.rt != null){
            if(node.rt.symbol == '*'){
                node.num++;
            }else{
                if(!node.rt.beenHere){
                    SumMines(node.rt);
                }
            }
        }
        if(node.r != null){
            if(node.r.symbol == '*'){
                node.num++;
            }else{
                if(!node.r.beenHere){
                    SumMines(node.r);
                }
            }
        }
        if(node.rb != null){
            if(node.rb.symbol == '*'){
                node.num++;
            }else{
                if(!node.rb.beenHere){
                    SumMines(node.rb);
                }
            }
        }
        if(node.b != null){
            if(node.b.symbol == '*'){
                node.num++;
            }else{
                if(!node.b.beenHere){
                    SumMines(node.b);
                }
            }
        }
        if(node.lb != null){
            if(node.lb.symbol == '*'){
                node.num++;
            }else{
                if(!node.lb.beenHere){
                    SumMines(node.lb);
                }
            }
        }
    }

    private static void print(Node[][] map, int fieldNo){
        System.out.println("Field #" + fieldNo + ":");
        for(int i=0; i<map.length; i++){
            for(int j=0; j<map[i].length; j++){
                System.out.print(map[i][j].symbol == '*' ? "*" : (int)map[i][j].num);
            }
            if(i<map.length - 1){
                System.out.println();
            }
        }
    }

    public static void main(String[] args) throws FileNotFoundException {
        // Scanner sc = new Scanner(System.in);
        Scanner sc = new Scanner(new File("Minesweeper\\input.txt"));

        int i = 0;
        boolean flag = false;
        while (true) {
            int rows = sc.nextInt();
            int cols = sc.nextInt();

            if(rows != 0 && cols != 0){
                if(flag){
                    System.out.println("\n");
                }
                sc.nextLine();
                char[][] area = new char[rows][cols];
                for(int r = 0; r < rows; r++){
                    String line = sc.nextLine();
                    for(int c = 0; c < cols; c++){
                        area[r][c] = line.charAt(c);
                    }
                }

                print(solve(area), ++i);
                flag = true;
            }else{
                break;
            }
        }
    }
}