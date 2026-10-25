
package model;

public class Investidor extends Pessoa {

    private double saldoEmReais;
    private Carteira carteira;

    public Investidor(String nome, String cpf, String senha) {

        super(nome, cpf, senha);

        this.saldoEmReais = 0.0;
        this.carteira = new Carteira(this);
    }

    public double getSaldoEmReais() {
        return saldoEmReais;
    }

    public void setSaldoEmReais(double saldoEmReais) {
        this.saldoEmReais = saldoEmReais;
    }

    public Carteira getCarteira() {
        return carteira;
    }
}
