
package Controller;

import model.Investidor;

public class Teste {

    public static void main(String[] args) {

        Investidor investidor = new Investidor(
    "Giovanna",
    "12345678909",
    "123456"
);

        System.out.println("ID: " + investidor.getId());
        System.out.println("Nome: " + investidor.getNome());

        System.out.println("Saldo: " +
                investidor.getCarteira().getSaldoEmReais());

        System.out.println("Bitcoin: " +
                investidor.getCarteira().getQtdBitcoin());
    }
}
