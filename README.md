# 👑 Simulador do Problema das N-Rainhas com Inteligência Artificial

Este projeto é uma ferramenta visual e interativa desenvolvida para demonstrar, passo a passo, como um algoritmo de Inteligência Artificial resolve o clássico **Problema das N-Rainhas**. A interface foi projetada para fins didáticos, permitindo visualizar o comportamento do algoritmo, pausar para explicações e acompanhar métricas em tempo real.

---

## 💻 Interface da Ferramenta

A aplicação é dividida em quatro seções principais de forma a facilitar a interação e o acompanhamento do processo de busca da solução:

### 1. Painel de Configuração (Lado Esquerdo)
Contém todos os controles necessários para ditar as regras do tabuleiro e o comportamento da execução:
* **Tamanho do Tabuleiro (N):** Define o número de rainhas e a dimensão do tabuleiro (ex: se definido como 9, cria um tabuleiro de 9x9 com 9 rainhas). *Nota: Limitado via código entre 4 e 16 para garantir a estabilidade do navegador.*
* **Velocidade do Passo:** Controle deslizante (*slider*) que define o tempo de cada jogada em milissegundos. Ideal para desacelerar o processo durante uma explicação detalhada ou acelerar para encontrar a solução rapidamente.
* **Botão "Gerar Novo Tabuleiro":** Reseta o estado atual. Distribui as rainhas de forma totalmente aleatória na tela, seguindo a restrição inicial de posicionar estritamente uma rainha por coluna.
* **Botão "Resolver com IA":** Inicia o algoritmo de busca. Ao ser acionado, ele bloqueia a alteração do tamanho do tabuleiro para evitar inconsistências durante o cálculo.
* **Botão "Pausar":** Congela a execução instantaneamente. Útil para pausar o algoritmo em um estado específico para análise ou explicações acadêmicas.

### 2. Status e Estatísticas (Canto Inferior Esquerdo)
Exibe o monitoramento em tempo real do desempenho e estado atual do algoritmo:
* **Conflitos Atuais:** Quantidade de rainhas que estão se atacando mutuamente (seja na mesma linha ou nas diagonais). O objetivo final do algoritmo é reduzir este contador a **0**.
* **Iterações:** Contador cumulativo de jogadas/movimentos testados pelo algoritmo desde o início da execução.
* **Estado:** Indica o status atual do sistema (`Pronto`, `Buscando...`, `Pausado` ou `Sucesso!`).

### 3. O Tabuleiro e as Peças (Centro)
A representação visual do problema em formato de matriz:
* **Estilo Xadrez Dinâmico:** Renderiza-se autonomamente e adapta o tamanho das casas e das peças proporcionalmente ao valor de $N$ escolhido.
* **Etiquetas identificadoras (R0, R1, R2...):** Cada rainha possui uma identificação fixa baseada na sua coluna (a rainha da coluna 0 é a `R0`, da coluna 1 é a `R1`, etc.). Isso facilita rastrear quais peças se moveram verticalmente.
* **Destaque de Movimento:** Sempre que uma rainha altera sua posição, a casa de destino recebe um destaque visual de fundo e a peça executa uma animação de pulo.

### 4. Histórico de Decisões (Lado Direito)
Funciona como o "diário de bordo" do algoritmo, imprimindo logs em tempo real sobre o raciocínio da IA através de um sistema de cores:
* 🔵 **Mensagem Azul:** Indica movimentações padrão. *Ex: "A Rainha R3 movida para a linha 4"*.
* 🟡 **Mensagem Amarela (Alerta):** Indica que o algoritmo atingiu um ótimo local onde não há movimentos melhores possíveis, mas o problema não foi resolvido. *Ex: "Preso em Máximo Local... Aplicando Random Restart"*. O tabuleiro será reembaralhado automaticamente.
* 🟢 **Mensagem Verde:** Emitida quando o objetivo é alcançado. *Ex: "Sucesso! Solução encontrada..."*.

---

## ⚙️ O Algoritmo
O projeto utiliza uma abordagem de busca local (como o **Subida de Encosta / Hill Climbing**) combinada com a estratégia de **Random Restart** (Reinício Aleatório) para escapar de máximos locais e garantir que a solução ideal (0 conflitos) seja encontrada mesmo em tabuleiros maiores.
