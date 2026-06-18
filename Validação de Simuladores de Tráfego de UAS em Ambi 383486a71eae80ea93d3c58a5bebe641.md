# Validação de Simuladores de Tráfego de UAS em Ambientes Urbanos: Parâmetros Fundamentais, Regulamentações e Panorama de Ferramentas

O avanço acelerado dos Sistemas de Aeronaves Não Tripuladas (UAS) e a consolidação dos conceitos de Mobilidade Aérea Urbana (UAM) e do U-space impõem a necessidade de estruturar o espaço aéreo de baixa altitude de forma altamente segura e escalável. A transição para operações comerciais complexas, particularmente aquelas executadas Além do Alcance Visual do Piloto (BVLOS), exige o desenvolvimento de simuladores de tráfego aéreo validados.

Essas plataformas virtuais servem como ambientes primários para a verificação de algoritmos de controle, mitigação de riscos de colisão e conformidade com as rígidas metodologias de análise de risco operacional, como o SORA (*Specific Operations Risk Assessment*), adotado pela Agência Europeia para a Segurança da Aviação (EASA).

Para que um ambiente de simulação seja validado e aceito por autoridades regulatórias e agentes de mercado, ele deve ir além da mera renderização visual, integrando modelos matemáticos e físicos que repliquem com fidelidade as condições operacionais urbanas. Isso compreende:

- A representação da topografia e relevo físico das cidades;
- As perturbações de microclima atmosférico;
- Os canais de radiofrequência e suas perdas;
- A degradação dos sistemas de posicionamento por satélite;
- O comportamento dinâmico de tráfegos cooperativos e não cooperativos.

# 1. Parâmetros Fundamentais para a Validação de Ambientes de Simulação

A integridade técnica de um simulador de tráfego de UAS baseia-se na qualidade e no nível de detalhamento dos dados de entrada. A modelagem precisa de cenários urbanos requer a representação matemática de diversas variáveis ambientais e operacionais.

| **Categoria de Dados** | **Parâmetros de Entrada Críticos** | **Impacto Físico e Operacional na Simulação** | **Embasamento Normativo e Científico** |
| --- | --- | --- | --- |
| **Geoespaciais (GIS) e 3D**  | Modelos Digitais de Elevação (DEM), layouts de edifícios em 3D, limites geométricos de geofencing.  | Oclusão física de sensores, planejamento de trajetórias livres de colisão e determinação de zonas de exclusão.  | Definição de volumes de operação tridimensionais (OVs) e mitigação de invasão de áreas restritas.  |
| **Meteorológicos e Microclima**  | Perfis de vento 3D, turbulência induzida por edifícios, temperatura local e Ilhas de Calor Urbanas (UHI).  | Perturbação do envelope aerodinâmico, desvios de rota e flutuações na taxa de descarga das baterias.  | Determinação das margens de segurança física e definição dos limites de vento sob o SORA.  |
| **Radiofrequência (RF) e GNSS**  | Atenuação de sinal por materiais, zonas de sombreamento de satélites (canyons urbanos), gradiente de refractividade.  | Perda temporária do C2 Link, degradação de precisão posicional (GNSS drift) e perda de pacotes de telemetria.  | Atendimento aos Objetivos de Segurança Operacional (OSO #6 e OSO #18) para níveis elevados de SAIL.  |
| **Operacionais e Tráfego**  | Volumes de Operação 4D, tráfego cooperativo e não cooperativo (intrusos).  | Execução de desconflito tático e estratégico, geração de alertas de colisão e desvios dinâmicos.  | Alinhamento com os limites de DAA Well Clear (DWC) e algoritmos de prevenção como o ACAS sXu.  |
| **Dinâmica de Voo**  | Modelos não lineares de motores, coeficientes aerodinâmicos do veículo e respostas de atuadores.  | Replicabilidade física de manobras evasivas severas e resposta aerodinâmica sob rajadas de vento.  | Garantia de estabilidade sob o requisito de proteção automática del envelope de voo (OSO #18).  |

## 1.1 Dados Geoespaciais e Estruturais das Cidades

Os dados de Sistemas de Informação Geográfica (GIS) determinam a geometria física tridimensional onde os voos virtuais são executados. Em ambientes urbanos complexos, as estruturas verticais dos edifícios atuam como barreiras absolutas para a visada óptica de sensores de bordo e propagação eletromagnética. A modelagem dessas estruturas exige nuvens de pontos tridimensionais de alta precisão, geradas por varreduras LiDAR ou fotogrametria aérea, permitindo mapear o relevo com precisão centimétrica.

A representação acurada dos edifícios e da topografia é essencial para delimitar barreiras virtuais de segurança conhecidas como *geofencing* ou *geocaging*. O cruzamento dos dados de telemetria do drone com os limites georreferenciados do GIS em tempo de execução permite que o sistema simule gatilhos de contingência imediatos caso a aeronave saia de sua área autorizada.

## 1.2 Fenômenos Meteorológicos e Microclimáticos

A camada limite atmosférica urbana é caracterizada por regimes de ventos altamente instáveis e correntes de ar turbulentas geradas pelo impacto das massas de ar com a arquitetura das cidades. A validação de simuladores de tráfego de UAS exige o acoplamento de modelos climáticos detalhados, como o ENVI-met, que mapeiam o comportamento térmico das superfícies e os efeitos das Ilhas de Calor Urbanas (UHI).

Essas perturbações meteorológicas geram esforços dinâmicos sobre o envelope aerodinâmico dos drones, alterando a estabilidade de atitude da aeronave própria (*ownship*) e exigindo um maior consumo energético dos motores para manter a sustentação e o direcionamento de rota. Se o simulador negligenciar a turbulência local, os testes de desvio de trajetórias e o cálculo de autonomia energética real das aeronaves serão imprecisos, resultando em falhas quando implantados no mercado físico.

## 1.3 Modelagem do Canal de RF e Sistemas de Navegação

O enlace de Comando e Controle (C2 Link) constitui o elemento mais crítico para a segurança de operações BVLOS em cidades. A propagação das ondas de rádio em canais urbanos sofre atenuações severas causadas por reflexões multipercurso, perdas por difração em arestas de edifícios e interferências eletromagnéticas ativas. Modelos matemáticos de propagação devem considerar a caracterização espacial da troposfera inferior. A refractividade atmosférica rege o comportamento de ondas de rádio e radares, e metodologias geoestatísticas como a Krigagem Universal (UK) ajudam a mapear o gradiente vertical dessa refractividade. Isso é crucial para prever fenômenos de propagação anômala de RF, tais como super-refrações e dutos térmicos, que causam perdas inesperadas de sinal de controle.

Paralelamente, a recepção de sinais de navegação por satélite (GNSS) é comprometida pelo efeito de "canyons urbanos", onde as estruturas dos prédios bloqueiam a linha de visada direta com os satélites de posicionamento. O simulador validado deve reproduzir o *drift* dinâmico do posicionamento GNSS, forçando os algoritmos de navegação embarcados a lidar com incertezas e a recorrer a sensores secundários ou a técnicas de RTK (*Real Time Kinematics*) para mitigar erros posicionais inferiores a 5 centímetros.

## 1.4 Operações em Quatro Dimensões (4D) e Modelagem de Tráfego

No ecossistema UTM, a alocação de espaço aéreo baseia-se no conceito de Volumes de Operação (OVs), que estruturam o espaço e o tempo (4D) de cada voo planejado. O simulador de tráfego de UAS deve ser capaz de receber, manipular e realizar o *deconfliction* estratégico de múltiplos volumes de operação simultâneos de aeronaves heterogêneas.

A representação do tráfego aéreo urbano envolve a geração de cenários de interação entre a aeronave própria e aeronaves intrusas. As aeronaves intrusas são classificadas como cooperativas (equipadas com transponders funcionais de ADS-B ou Remote ID) ou não cooperativas (aves, drones invasores ou aeronaves tripuladas sem transmissão de sinal ativo). Os parâmetros de velocidade relativa, trajetórias de colisão e tempos de aproximação tática são fundamentais para avaliar a capacidade do UAS de manter a separação e evitar colisões no espaço aéreo compartilhado.

# 2. Fundamentação Normativa e Diretrizes de Segurança (SORA, SAA e DAA)

A validação de simuladores de tráfego de UAS é guiada e regulada por padrões desenvolvidos pelas principais entidades de aviação civil do mundo, como a RTCA, a ASTM e a JARUS.

## 2.1 Critérios de Validação sob o SORA

A metodologia SORA classifica o risco operacional de voos na categoria específica por meio de Níveis de Garantia e Integridade de Segurança (SAIL). Operações comerciais complexas em áreas populosas ou com veículos de carga pesados geralmente atingem os níveis *SAIL III* ou *SAIL IV*, impondo exigências severas para a validação dos sistemas de controle e mitigação de riscos:

- **Objetivo de Segurança Operacional (OSO) #5:**
    - Exige a demonstração de alta confiabilidade de hardware e software do UAS. O simulador deve permitir ensaios automatizados de injeção de falhas para comprovar o comportamento do sistema sob perdas de motores, falhas de barramento e degradação de sensores.
- **OSO #6:**
    - Foca na integridade do enlace de dados C2. Exige ensaios de simulação que comprovem que a latência de transmissão das mensagens de controle permaneça dentro de limites seguros para evitar a perda de controle da aeronave, utilizando algoritmos robustos de verificação de erros como CRC32 para proteger o pacote de telemetria.
- **OSO #18:**
    - Demanda a presença de um sistema automático de proteção do envelope de voo. O simulador de voo integrado deve demonstrar que o piloto automático impede a aeronave de atingir atitudes críticas, velocidades excessivas ou taxas angulares perigosas que possam comprometer a integridade estrutural da aeronave.
- **Zonas de Buffer de Solo (Ground Risk Buffer):**
    - Conforme o Anexo B do SORA, o simulador deve ser utilizado para validar o buffer físico necessário para proteger pessoas em solo em caso de falha catastrófica. Aplica-se a regra de segurança de 1 para 1, onde a distância horizontal mínima do buffer de proteção deve ser igual à altitude operacional de voo (por exemplo, voos a 150 metros de altitude exigem um buffer horizontal terrestre mínimo de 150 metros de distância de segurança). A modelagem do buffer deve ser suportada por ensaios físicos de simulação dinâmica de queda livre balística de componentes do veículo sob ventos críticos.

## 2.2 Regulamentações de Detect and Avoid (DAA)

Para cumprir a equivalência técnica com o requisito clássico "see and avoid" da aviação tripulada, os sistemas de detecção e desvio de UAS são validados sob normas técnicas rigorosas de desempenho operacional mínimo.

### 2.2.1 RTCA DO-365 e a Arquitetura de Alertamento

A norma RTCA DO-365 estabelece os requisitos mínimos de desempenho de sistemas DAA para UAS. O sistema de alerta integrado à lógica de controle DAA processa os sinais dos sensores para classificar os níveis de risco de aproximação de alvos intrusos com base na coordenada de tempo restante para a penetração do volume geométrico do perigo ($t_{HAZ}$):

$$
\text{Alertas DAA (DO-365)} \Longrightarrow \begin{cases} \text{Preventivo:} & \text{Alerta de longo prazo; melhora da consciência situacional.} \\ \text{Corretivo:} & \text{Exige ação planejada do piloto para manter o Well Clear.} \\ \text{Advertência (Warning):} & \text{Perigo iminente; exige desvio tático imediato.} \end{cases}
$$

A parametrização dessas lógicas de alerta é frequentemente avaliada em simulação de tempo acelerado de encontros aéreos par a par para estabelecer limites seguros de alertas precoces e tardios sem que ocorra a ativação indevida ou excesso de falsos alarmes.

### 2.2.2 ASTM F3442 e o Modelo de Disco de Hóquei (*Hockey-Puck*)

Enquanto a norma RTCA DO-365 aborda UAS de grande porte sob regras de voo por instrumentos (IFR), a especificação *ASTM F3442* padroniza os requisitos operacionais para pequenos UAS (sUAS abaixo de 25 libras e velocidades inferiores a 100 nós) que voam em espaços aéreos de baixo e médio risco (Classes G e E, abaixo de 1.200 pés AGL).

A ASTM F3442 define a zona protetora padrão conhecida como *Remain Well Clear* (RWC) baseada em uma volumetria cilíndrica de proteção em formato de "disco de hóquei" centralizada na própria aeronave:

$$
\text{Volume de Proteção Cilíndrico (ASTM F3442)} \Longrightarrow \begin{cases} \text{Separação Horizontal Mínima:} & \text{2.000 pés } \approx 610 \text{ metros} \\ \text{Separação Vertical Mínima:} & \text{250 pés } \approx 76 \text{ metros} \end{cases}
$$

A simulação e validação do sistema DAA sob o critério ASTM F3442 devem demonstrar estatisticamente que a taxa de risco de colisão aérea (MAC) é severamente mitigada por meio do monitoramento de alcance contínuo do sensor e da execução precisa das curvas de desvio horizontal e vertical do piloto automático.

## 2.3 Tecnologias para Redução da Discrepância Sim-para-Real (*Sim-to-Real*)

A transferência direta de algoritmos de percepção visual e mapeamento espacial desenvolvidos em simuladores de videogame simplificados para o mundo físico resulta em falhas operacionais críticas, fenômeno conhecido na engenharia robótica como o abismo de domínio ou *sim-to-real gap*. Para fechar essa discrepância estatística de dados, o mercado de simulação utiliza métodos físicos e de aprendizado de máquina para fidedignizar os retornos de sensores artificiais.

- **Traçado de Raios (*Ray Tracing*) Eletromagnético e Óptico**

Sensores ativos como o LiDAR e o radar exigem simulações baseadas nas leis físicas de propagação e reflexão de luz e radiofrequência.

- **LiDAR ToF (*Time-of-Flight*)**
    - Mede as distâncias de obstáculos calculando o tempo decorrido ($\Delta t$) para o pulso do laser de comprimento de onda infravermelho de curto alcance (comumente 905 nm ou 1550 nm) ser emitido pelo laser e capturado pelo diodo receptor após refletir na superfície de obstáculos urbanos:
    
    $$
    d = \frac{c \cdot \Delta t}{2}
    $$
    
    A simulação computacional de LiDAR com base em traçado de raios (usando bibliotecas de aceleração gráfica GPU, como NVIDIA OptiX) executa esse cálculo integrando as variáveis de refletância física dos materiais por meio de funções de distribuição de refletância bidirecional (BRDF) e simula os desvios de feixe e perdas induzidos por partículas de chuva e névoa suspensas no ar, resultando em nuvens de pontos virtuais idênticas àquelas capturadas por sensores de borda físicos como os pucks de mapeamento.
    
- **Radares mmWave**
- Em frequências na banda Ka ou K (de 24 GHz a 77 GHz), a propagação das ondas milimétricas depende criticamente da Seção Reta de Radar ($RCS, \sigma$) dos alvos urbanos. A equação clássica de recepção de potência de sinal de rádio rege esse fenômeno físico:
    
    $$
    P_r = \frac{P_t \cdot G^2 \cdot \lambda^2 \cdot \sigma}{(4\pi)^3 \cdot r^4}
    $$
    
    Onde $P_t$ representa a potência de transmissão ativa do radar, $G$ a diretividade de ganho da antena, $\lambda$ o comprimento de onda operacional da banda e $r$ a distância até o alvo. Modelos assintóticos modernos baseados em física, como os engenheirados no solver Ansys HFSS SBR+, executam o traçado de caminhos eletromagnéticos incluindo difrações físicas secundárias e efeitos dinâmicos de aproximação Doppler de múltiplos alvos em frações de tempo reduzidas, permitindo gerar representações realistas de espectrogramas micro-Doppler induzidos pelo giro das pás dos rotores de drones intrusos para treinar algoritmos inteligentes de classificação.
    

## 2.4 Campos de Radiância Neural (NeRF) e Gaussian Splatting

Ao invés de despender longos períodos modelando de forma computacional manual cada geometria urbana e material dielétrico de cenários, técnicas de representação neural 3D aceleram a modelagem com base em dados ópticos coletados do mundo real.

- **Campos de Radiância Neural (NeRF):**
    - Trata-se de uma tecnologia baseada em redes neurais profundas (MLPs) que recebe uma entrada posicional contínua de cinco dimensões — compreendendo as coordenadas espaciais 3D  $x, y, z$ de amostragem de raio e os ângulos esféricos 2D $\theta, \phi$ de direção visual do observador — para prever a densidade volumétrica local e as emissões de cores de luz direcional RGB geradas por efeitos complexos de transparência e reflexão de materiais urbanos não-Lambertianos.
    - O método DVGO (*Direct Voxel Grid Optimization*) otimiza os tempos de computação dos NeRFs ao particionar o espaço volumétrico contínuo em grades de voxels tridimensionais explícitos, resolvendo a interpolação trilinear de forma direta nas arestas adjacentes de amostragem dos raios de câmera. As saídas de densidade são passadas por funções não lineares de ReLU e as saídas de cores são limitadas por operações de *clamping* para garantir limites físicos válidos e rápidos durante a retropropagação do aprendizado.
    - Aeronaves de pequeno porte, como os micro-drones Crazyflie 2.1 (com massa inferior a 100 gramas), utilizam o ecossistema de reconstrução em tempo de execução para planejar rotas e desvios táticos com base nas geometrias implícitas estimadas pela fusão de algoritmos de fotogrametria SfM (*Structure from Motion*) e modelos Neurais (*Nerfacto*).
- **3D Gaussian Splatting:**
    - Representa a cena através de milhões de elipsoides gaussianos explícitos, permitindo a renderização fotorrealista direta das superfícies em tempo real sem a necessidade de processar modelos neurais profundos de múltiplas camadas em PC Host.

## 2.4 Técnicas de Aprendizado de Máquina Baseadas em Difusão e Redes Adversárias

Modelos de IA generativa são aplicados para converter saídas geométricas limpas geradas em simuladores tradicionais para as distribuições de ruído estatístico reais dos sensores físicos.

As Redes Adversárias Generativas (GANs) realizam a transformação direta ponto a ponto de nuvens de dados voxelizados de simulação para nuvens de pontos que imitam com perfeição a variabilidade e distorções eletromecânicas encontradas nos conjuntos de dados físicos reais de ITS (Sistemas de Transporte Inteligentes). Essa transposição de domínio baseada em redes geradoras e discriminadoras reduz o erro de transferência e melhora as taxas de acerto médio de mAP de redes neurais profundas de 20,3% para mais de 42,5% utilizando apenas os conjuntos adaptados.

Os modelos de difusão condicional (como o RadarSFD e o RadarGen) são aplicados para a síntese realista de dados de radar milimétrico. O framework *RadarSFD* atua como uma rede de difusão latente condicionada por mapas de profundidade monocular gerados opticamente para reconstruir nuvens de pontos densas equivalentes a saídas de LiDAR a partir de uma única amostragem de radar mmWave esparsa. Já o *RadarGen* traduz nuvens de pontos de radar brutas em imagens BEV de múltiplos canais:

$$
M_p = K_\sigma * P_{xy}
$$

Onde o mapa de densidade de pontos $M_p$ é obtido pela convolução bidimensional da distribuição esparsa original de pontos $P_{xy}$ com uma função de kernel Gaussiano $K_\sigma$ de dispersão de variância regulável $\sigma$, emparelhando as matrizes com mapas de RCS ($M_r$) e velocidade Doppler ($M_d$) em células espaciais representadas por diagramas de mosaico de Voronoi. As representações convertidas em imagens são processadas por modelos eficientes de difusão de imagens latentes (como o SANA) para criar dados sintéticos de alta fidelidade que preservam as assinaturas físicas complexas dos alvos reais.

# 3. Comunicação Cooperativa e Sistemas V2X na Simulação de UTM

As simulações de tráfego de UAS urbanos dependem fortemente da representação detalhada das tecnologias de comunicação celular e veículo-para-tudo (C-V2X).

## 3.1 O Canal de Comunicação Sidelink PC5

A tecnologia C-V2X adota a interface de comunicação direta por rádio frequência conhecida como Sidelink PC5 (definida pelo 3GPP no Release 14 para LTE-V2X e estendida no Release 16 para 5G NR-V2X). O canal Sidelink opera de forma autônoma na banda de segurança de transporte inteligente protegida de 5,9 GHz, dispensando a necessidade de cobertura ativa de estações rádio base de operadoras de telefonia comercial.

As mensagens de segurança essenciais e planos de desvio de rotas de segurança são transmitidos diretamente entre as aeronaves próprias e os atores circundantes com latências de transmissão ultrabaixas, consistentemente inferiores a 20 milissegundos. Nas simulações de tráfego, as transmissões PC5 são divididas em dois modos funcionais distintos.

## 3.2 Protocolos de Rede e Desempenho Cooperativo

Para validar o intercâmbio de mensagens de segurança e prevenção rápida de colisões entre veículos de terra e aeronaves, diferentes protocolos de rede de transporte de dados são modelados e comparados em malha de simulação real.

| **Protocolo de Comunicação** | **Latência Média de Loop** | **Taxa de Entrega com Sucesso** | **Comportamento sob Alta Densidade de Tráfego** | **Principais Casos de Uso** |
| --- | --- | --- | --- | --- |
| **DSRC (802.11p)**  | Baixa (10 a 25 ms).  | Elevada (menor perda de pacotes).  | Degradada por colisão de pacotes de canais em congestionamentos urbanos massivos.  | Interconexão tática direta e local e envio de alertas táticos de solo.  |
| **UDP (User Datagram Protocol)**  | Ultrabaixa (menor overhead).  | Moderada (sem garantia de entrega).  | Perda de pacotes elevada sob gargalos físicos de canal de rádio de borda.  | Envio em tempo de execução de streams de dados brutos e telemetria de piloto automático.  |
| **WebSocket (4G/5G)**  | Moderada (30 a 80 ms).  | Elevada (transporte TCP de controle).  | Sensível a flutuações de latência de rede celular comercial de telefonia.  | Envio dinâmico de capturas de imagens aéreas e dados de sensores secundários.  |
| **TCP (Transmission Control Protocol)**  | Elevada (overhead de handshake).  | Máxima (mecanismo de retransmissão).  | Alto congestionamento de banda e latências elevadas sob congestionamentos.  | Conexão estática de planejamento de voo prévio e interconexão de sistemas UTM.  |

A interconexão tática dinâmica de *swarms* de UAS é coordenada por modelos de otimização distribuídos, como o Algoritmo de Feixe Consensual Dinâmico (D-CBBA), que realiza a programação inteligente do uso de recursos de subcanais de sidelink sem causar colisões de ondas eletromagnéticas ou interferências prejudiciais de rádio na rede ad-hoc aérea (FANET).

## 3.3 O Papel de Infraestruturas de Borda Terrestre (RSUs)

O espaço aéreo de baixa altitude pode se beneficiar do aproveitamento de infraestruturas de Sistemas de Transporte Inteligente já instaladas nas vias urbanas, especificamente as Unidades de Borda de Estrada (RSUs). Essas RSUs, espaçadas fisicamente de 2 a 5 quilômetros ao longo de corredores de transporte rodoviário, podem ser equipadas para executar varreduras passivas de espectro de RF nas bandas ISM e canais de comunicação ITS protegidos para detectar as transmissões de telemetria física emitidas por UAS não autorizados.

A execução de cross-correlações espectrais locais e de técnicas de localização por multilateração (MLAT) e estimativa de ângulo de chegada (AoA) nas RSUs adjacentes permite geolocalizar com precisão drones invasores sem sobrecarregar as bandas dedicadas aos serviços de controle aeronáutico primários.

# 4. Integração de Hardware e Malhas de Teste (SIL e HIL)

A validação de simuladores de tráfego de UAS exige o cumprimento de etapas sucessivas de ensaios virtuais em malha de controle, progredindo de modelos puramente lógicos de simulação em software para testes que integram os componentes de hardware reais de aviação.

- **Software-in-the-Loop (SIL)**

No ambiente SIL (ou SITL - *Software-in-the-Loop*), o código binário de controle do piloto automático (como o ArduPilot ou PX4) é compilado diretamente no processador do computador de desenvolvimento utilizando compiladores C++ convencionais, rodando de forma integrada em ambiente de simulação lógica nativo sem a dependência de placas ou chipsets físicos. Os sensores, a dinâmica de voo multidimensional e o ambiente externo são simulados via software.

A vantagem de testes SIL consiste na facilidade de integração com softwares de depuração interativos de desktop, analisadores estáticos e ferramentas de modelagem dinâmica como o MATLAB/Simulink. Isso possibilita realizar ensaios rápidos em tempo acelerado para validar as lógicas básicas de *deconfliction* de rotas, curvas PID e interceptação de comandos do UTM.

- **Hardware-in-the-Loop (HIL)**

O ambiente HIL (ou HITL - *Hardware-in-the-Loop*) conecta o computador de voo físico real (o microcontrolador do piloto automático, como placas Pixhawk ou sistemas Veronte redundantes) a um processador simulador de tempo real acoplado que emula fisicamente todos os retornos elétricos que a aeronave veria durante a operação física. Os barramentos de comunicação eletrônica reais do piloto automático são integrados diretamente ao sistema HIL.

Durante a simulação HIL, a dinâmica de voo física e o comportamento cinemático do drone são calculados de forma *real-time* pelo simulador da planta do veículo. O sistema injeta os dados simulados através de mensagens MAVLink específicas, como os pacotes `HIL_SENSOR` e `HIL_GPS`, alimentando a memória lógica do piloto automático como se a aeronave estivesse voando fisicamente em coordenadas reais. Simultaneamente, o piloto automático processa esses dados internamente no processador físico e transmite a telemetria de volta por barramentos lógicos uORB reais, lendo as estimativas de variáveis críticas de controle embarcadas:

$$
\text{Tópicos uORB (HIL)} \Longrightarrow \begin{cases} \text{VehicleLocalPosition:} & \text{Estimativa de posição local real-time.} \\ \text{VehicleAttitude:} & \text{Consciência de atitude e estabilização de eixos.} \\ \text{VehicleOdometry:} & \text{Estado de movimento tridimensional e vetores de velocidade.} \\ \text{ActuatorArmed:} & \text{Status físico de acionamento das saídas eletrônicas.} \end{cases}
$$

A realização de ensaios HIL é crucial por conseguir identificar falhas físicas latentes de barramento eletrônico e hardware que são indetectáveis sob o ambiente lógico de simulação SIL. Essas falhas compreendem *jitter* de clocks internos do microcontrolador, atrasos excessivos em transmissões de barramento físico de controle (como barramentos CAN ou barramentos militares MIL-STD-1553), latências críticas em processamento de imagens e interrupções inesperadas de rotinas do processador.

Equipamentos industriais de simulação física HIL de alto isolamento eletromagnético (como os da UEI) fornecem garantias de isolamento de canais elétricos de até 350 VRMS e robustez estrutural sob choques de até 100g e temperaturas operacionais extremas (de -40 a 85 °C), garantindo que as malhas de testes eletrônicas reproduzam com fidelidade o comportamento físico das aeronaves e diminuam sensivelmente o risco de perdas balísticas em missões comerciais.

# 5. Panorama de Softwares e Soluções de Mercado para Simulação de UTM

O desenvolvimento e a certificação de sistemas UTM sustentam-se em uma variedade de ecossistemas de simulação com diferentes propósitos industriais e de pesquisa.

Análise Comparativa de Ferramentas de Simulação 

| **Plataforma de Simulação** | **Tipo de Licença / Código** | **Modelo de Renderização e Física** | **Nível de Integração Real-Time (SIL/HIL)** | **Diferenciais Tecnológicos no Ecossistema de UAS** |
| --- | --- | --- | --- | --- |
| **ArduPilot SITL / PX4 SIL**  | Open-source (C++).  | Modelagem de dinâmica de voo integrada de multirotores, asas fixas e híbridos.  | Amplo suporte nativo a simulações de Software e Hardware-in-the-Loop.  | Oferece compatibilidade com ferramentas avançadas de visualização desktop (FlightGear) e middlewares de robótica como ROS 1 e ROS 2.  |
| **NVIDIA Isaac Sim**  | Licença Comercial / Proprietária.  | Visualização fotorrealista avançada (Ray Tracing RTX) baseada no padrão aberto OpenUSD.  | Integração direta com SIL e HIL de sensores visuais, LiDAR e radares RTX.  | Integração nativa com bibliotecas de aprendizado robótico por reforço (Isaac Lab) e modelos mundiais de inteligência artificial generativa.  |
| **U-TRAFMAN**  | Plataforma de Pesquisa / Acadêmica.  | Motor físico integrado em ambiente do Gazebo voltado ao voo de frotas dinâmicas de drones.  | Integração nativa baseada na comunicação de dados via tópicos e serviços do ROS.  | Arquitetura focada na validação de conceitos de U-space, monitoramento dinâmico de tráfego, telemetria e deconfliction de voos via Matlab.  |
| **Ansys RF Channel Modeler**  | Licença Comercial Corporativa.  | Simulação eletromagnética de alta fidelidade física baseada no solver HFSS SBR+.  | SIL eletromagnético avançado para sensores e antenas.  | Permite a modelagem realista em tempo quase real de assinaturas complexas de radares e atenuações de C2 Link acelerada por GPUs corporativas.  |
| **BlueSky (TU Delft)**  | Open-source (Python).  | Simulação simplificada de tráfego aéreo de média fidelidade com alto foco em capacidade e fluxo.  | SIL em larga escala de simulação rápida em tempo acelerado de redes aéreas federadas.  | Utilizado como o core de validação de projetos regulatórios europeus (SESAR) para testar conformidade com padrões de deconfliction da ASTM.  |

6. Conclusões e Recomendações Comerciais 

A validação rigorosa de cada parâmetro de entrada nos simuladores de tráfego de UAS é fundamental para habilitar o desenvolvimento de modelos comerciais economicamente sustentáveis e seguros de mobilidade aérea. A análise detalhada da engenharia de simulação indica as seguintes diretrizes para empresas e proponentes operacionais de UAS:

- **Abordagem Georreferenciada Multimodal:**
    - Para obter homologação regulatória sob o SORA para SAIL III e IV, o simulador de tráfego deve integrar dados de relevo GIS reais com mapeamento dinâmico de refractividade atmosférica e modelos turbulentos de ventos urbanos de camada limite. A desconsideração dessas dinâmicas induz a erros no cálculo de trajetórias e autonomia de bateria.
- **Adoção de Ferramentas Baseadas em Física e Redução de Domínio (*Sim-to-Real*):**
    - O desenvolvimento de sistemas de visão autônoma e DAA não deve depender de modelagens manuais simplificadas de ambientes 3D. A integração de traçado de raios físico (como NVIDIA OptiX ou solvers de eletromagnetismo como o Ansys HFSS) deve ser combinada com redes geradoras adversárias (GANs) ou modelos de difusão condicional (como RadarSFD e RadarGen) para ajustar a estatística de ruído eletromecânico e evitar falhas de percepção no mundo físico.
- **Metodologia de Testes em Pipeline SIL-para-HIL:**
    - O ciclo de engenharia do piloto automático e da plataforma UTM deve adotar uma sequência rigorosa de testes. O ambiente SIL deve ser explorado massivamente para varrer cenários de aproximação tática par a par em tempo acelerado (com base em limites ASTM F3442 e algoritmos de alertas DO-365). Em seguida, as lógicas críticas de prevenção automática de colisões e envelopes de voo devem ser obrigatoriamente submetidas a ensaios HIL em tempo real, mitigando os riscos de latência de clock e barramentos que colocam em risco a segurança das frotas aéreas.

Ao incorporar de forma sistêmica as diretrizes de modelagem física precisa e conformidade regulatória estrita, as plataformas de simulação de tráfego tornam-se ferramentas de validação confiáveis, minimizando custos de desenvolvimento e habilitando a operação segura de drones na baixa altitude urbana.

# Referências

- **JOVER, Jesús; CASADO, Rafael; BERMÚDEZ, Aurelio. U-TRAFMAN: Unmanned traffic management simulator**. *SoftwareX*, [s. l.], v. 30, art. 102096, fev. 2025. Disponível em: [https://doi.org/10.1016/j.softx.2025.102096](https://doi.org/10.1016/j.softx.2025.102096). Acesso em: 16 jun. 2026.
- **EUROPEAN UNION AVIATION SAFETY AGENCY (EASA). *Urban Air Mobility (UAM)***. Colônia: EASA, [202-?]. Disponível em: [https://www.easa.europa.eu/en/domains/drones-air-mobility/drones-air-mobility-landscape/urban-air-mobility-uam](https://www.easa.europa.eu/en/domains/drones-air-mobility/drones-air-mobility-landscape/urban-air-mobility-uam). Acesso em: 16 jun. 2026.
- **EUROCONTROL. *Advancing U-space implementation through a collaborative approach to simulation***. Bruxelas: EUROCONTROL, 18 mar. 2024. Disponível em: [https://www.eurocontrol.int/article/advancing-u-space-implementation-through-collaborative-approach-simulation](https://www.eurocontrol.int/article/advancing-u-space-implementation-through-collaborative-approach-simulation). Acesso em: 16 jun. 2026.
- **NVIDIA CORPORATION. Action and Event Data Generation. In: NVIDIA CORPORATION**. *Isaac Sim Documentation*. Versão 5.1.0. Santa Clara: Nvidia, 4 jun. 2026. Disponível em: [https://docs.robotsfan.com/isaacsim/5.1.0/action_and_event_data_generation/index.html](https://docs.robotsfan.com/isaacsim/5.1.0/action_and_event_data_generation/index.html). Acesso em: 17 jun. 2026.
- **JOVER, Jesús; CASADO, Rafael; BERMÚDEZ, Aurelio. Conflict Detection and Resolution for Advanced Air Mobility inside U-Space: A Simulation Study**. *Drones*, Basileia, v. 10, n. 6, art. 397, jun. 2026. Disponível em: [https://doi.org/10.3390/drones10060397](https://doi.org/10.3390/drones10060397). Acesso em: 17 jun. 2026.
- T**URCO, Lorenzo; ZHAO, Junjie; XU, Yan; TSOURDOS, Antonios. A Study on Co-simulation Digital Twin with MATLAB and AirSim for Future Advanced Air Mobility**. In: *IEEE AEROSPACE CONFERENCE*, 2024, Big Sky. *Proceedings* [...]. Los Alamitos: IEEE Computer Society, 2024. Disponível em: [https://doi.org/10.1109/AERO58975.2024.10521333](https://doi.org/10.1109/AERO58975.2024.10521333). Acesso em: 18 jun. 2026.