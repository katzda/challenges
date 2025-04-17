package ThreePlusOne;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;

class Main {
    public static void main(String[] args) throws FileNotFoundException {
        // Scanner sc = new Scanner(System.in);
        Scanner sc = new Scanner(new File("ThreePlusOne\\input.txt"));

        boolean flag = false;
        while (sc.hasNextInt()) {
            int n1 = sc.nextInt();
            int n2 = sc.nextInt();

            if(flag){
                System.out.println();
            }

            solve(n1, n2);
            flag = true;
        }
    }

    private static int Calc(int n){
        return n%2==0 ? n/2 : 3*n+1;
    }

    private static int CalcCycleLength(int n) {
        int cycleLength=1;
        while(n != 1){
            cycleLength++;
            n = Calc(n);
        }
        return cycleLength;
    }

    private static void solve(int n1, int n2) {
        int maxCycleLength = -1;
        for(int i=n1; i<=n2 ; i++){
            int cycleLength = CalcCycleLength(i);
            if(cycleLength > maxCycleLength){
                maxCycleLength = cycleLength;
            }
        }

        System.out.print(String.format("%d %d %d", n1, n2, maxCycleLength));
    }
}