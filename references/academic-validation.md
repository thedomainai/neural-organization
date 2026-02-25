# Neural Organization 学術的検証レポート

Neural Organization の設計思想・不変原理・アーキテクチャに対する、3つの学術ドメインからの体系的な検証結果を統合した参照ドキュメントである。

## 調査ドメイン

1. 認知科学・脳科学
2. 組織論・社会学・行動経済学
3. 複雑系科学・マルチエージェントシステム

---

## 1. 主張別の学術的根拠サマリ

### 非常に強い根拠（複数ドメインから独立に支持）

| 主張 | 認知科学 | 組織論 | 複雑系/MAS |
|---|---|---|---|
| **人間の注意は有限資源である** | Miller (1956) 7±2則, Cowan (2001) 4チャンク, Sweller 認知負荷理論, Simon 限定合理性 | — | Simon 限定合理性, Miller 7±2則 |
| **計測なきシステムは収束しない** | Flavell メタ認知, Schön 省察的実践 | Argyris ダブルループ学習 | Wiener サイバネティクス, Ashby 必要多様性, Deming PDCA, Hollnagel 4つの礎石 |
| **優雅な劣化** | — | — | Woods graceful extensibility (2015, 2018), Carlson & Doyle HOT理論, レジリエンスエンジニアリング |
| **Agency Preservation（主体性保全）** | — | スキルデグラデーション研究（航空・医療・法律）, Ryan & Deci SDT の自律性欲求 | — |

### 強い根拠

| 主張 | 主な根拠 |
|---|---|
| **能力による間接参照** | Smith Contract Net Protocol (1980), SOAサービスディスカバリ, MasRouter (2025), Ashby 必要多様性の法則 |
| **信頼の段階的蓄積** | Hersey-Blanchard 状況適応型リーダーシップ, Lewicki et al. 信頼段階モデル, Mayer et al. 信頼の統合モデル, Lee & See 信頼キャリブレーション, de Visser 適応的信頼較正 |
| **Governance, not Control** | Davis et al. スチュワードシップ理論, Ostrom 立憲的統治, Donaldson & Davis 実証研究（信頼ベース > 監視ベース）|
| **定型的推論と創発的推論の二刀流** | Kahneman System 1/2, Evans & Stanovich デフォルト介入主義モデル, Laird Soar 3処理レベル |
| **修正行為が最も価値の高い学習データ** | Polanyi 暗黙知, Nonaka & Takeuchi SECI Externalization |
| **領域横断的な判断** | Thompson 相互依存性, Malone & Crowston コーディネーション理論, O'Reilly & Tushman 組織的両利き |

### 部分的に支持

| 主張 | 支持の程度と制約 |
|---|---|
| **5層認知パイプライン** | 脳の階層的処理(Felleman & Van Essen), OODA, SMM, VSMと構造的類似性あり。ただし5層の区分自体は設計判断であり科学的必然ではない |
| **5つの人間参与形態** | SDT 3欲求充足, Weick センスメイキングに基づく理論的正当化は可能。ただし5分類自体の実証的検証は未存在 |
| **Mutual Evolution** | 人間-AI補完性研究, Argyris ダブルループ学習が間接的支持。「相互進化」の実証例は限定的 |
| **構成と状態のデータ化** | Event Sourcing, GitOps, Maturana & Varela オートポイエーシス。有用な設計パターンだが「不変原理」としてはやや弱い |

### 2つのドメインが同じ原理に収束した（主張の妥当性）

**支持する根拠:**
- von Bertalanffy (1968): 一般システム理論 — 異なる分野でアイソモルフィックな法則が現れることは「単なるアナロジー以上のもの」
- Csete & Doyle (2002): 生物学と工学の収斂進化 — モジュラーアーキテクチャ、プロトコル階層、フィードバック制御への収斂を実証
- Laird, Lebiere & Rosenbloom (2017): 3つの独立した認知アーキテクチャが40年で共通原理に収斂

**批判的視点:**
- マルチエージェントオーケストレーションと組織設計は「分散する情報処理エージェントの協調」という共通の問題構造を持つ。「独立な収斂」よりも「同一問題のスケール変換」と解釈する方が正確かもしれない

---

## 2. ドメイン別の主要参考文献

### 認知科学・脳科学

**限定合理性・注意の有限性:**
- Simon, H.A. (1955). "A Behavioral Model of Rational Choice." *QJE*, 69(1), 99-118.
- Miller, G.A. (1956). "The Magical Number Seven, Plus or Minus Two." *Psychological Review*, 63, 81-97.
- Cowan, N. (2001). "The magical number 4 in short-term memory." *BBS*, 24(1), 87-114.
- Sweller, J. (1988). "Cognitive Load during Problem Solving." *Cognitive Science*, 12, 257-285.

**二重過程理論:**
- Kahneman, D. (2011). *Thinking, Fast and Slow.* Farrar, Straus and Giroux.
- Evans, J.St.B.T. & Stanovich, K.E. (2013). "Dual-Process Theories of Higher Cognition." *Perspectives on Psychological Science*, 8(3), 223-241.

**分散認知・拡張認知:**
- Hutchins, E. (1995). *Cognition in the Wild.* MIT Press.
- Clark, A. & Chalmers, D.J. (1998). "The Extended Mind." *Analysis*, 58(1), 7-19.

**脳の階層的処理:**
- Felleman, D.J. & Van Essen, D.C. (1991). "Distributed Hierarchical Processing in the Primate Cerebral Cortex." *Cerebral Cortex*, 1(1), 1-47.
- Friston, K. (2010). "The free-energy principle: a unified brain theory?" *Nature Reviews Neuroscience*.

**メタ認知:**
- Flavell, J.H. (1979). "Metacognition and Cognitive Monitoring." *American Psychologist*, 34(10), 906-911.
- Schön, D.A. (1983). *The Reflective Practitioner.* Basic Books.

**暗黙知:**
- Polanyi, M. (1966). *The Tacit Dimension.* University of Chicago Press.
- Nonaka, I. & Takeuchi, H. (1995). *The Knowledge-Creating Company.* Oxford University Press.

**自動化への信頼:**
- Lee, J.D. & See, K.A. (2004). "Trust in Automation: Designing for Appropriate Reliance." *Human Factors*, 46(1), 50-80.

### 組織論・社会学・行動経済学

**組織設計論:**
- Galbraith, J.R. (1974). "Organization Design: An Information Processing View." *Interfaces*, 4(3), 28-36.
- Mintzberg, H. (1979). *The Structuring of Organizations.* Prentice-Hall.
- Thompson, J.D. (1967). *Organizations in Action.* McGraw-Hill.

**委任理論・スチュワードシップ理論:**
- Jensen, M.C. & Meckling, W.H. (1976). "Theory of the Firm." *JFE*, 3(4), 305-360.
- Davis, J.H., Schoorman, F.D. & Donaldson, L. (1997). "Toward a Stewardship Theory of Management." *AMR*, 22(1), 20-47.
- Hersey, P. & Blanchard, K.H. (1977). *Management of Organizational Behavior.* Prentice-Hall.

**信頼研究:**
- Mayer, R.C., Davis, J.H. & Schoorman, F.D. (1995). "An Integrative Model of Organizational Trust." *AMR*, 20(3), 709-734.
- Lewicki, R.J., Tomlinson, E.C. & Gillespie, N. (2006). "Models of Interpersonal Trust Development." *JoM*, 32(6), 991-1022.
- de Visser, E.J. et al. (2020). "Adaptive Trust Calibration for Human-AI Collaboration." *PLOS ONE*.

**コーディネーション:**
- Malone, T.W. & Crowston, K. (1994). "The Interdisciplinary Study of Coordination." *ACM Computing Surveys*, 26(1), 87-119.
- O'Reilly, C.A. & Tushman, M.L. (2013). "Organizational Ambidexterity." *AMP*, 27(4), 324-338.

**センスメイキング:**
- Weick, K.E. (1995). *Sensemaking in Organizations.* SAGE.

**Human-AI Teaming:**
- Parasuraman, R., Sheridan, T.B. & Wickens, C.D. (2000). "A Model for Types and Levels of Human Interaction with Automation." *IEEE Trans. SMC*, 30(3), 286-297.
- Marquet, D. (2013). *Turn the Ship Around!* (Intent-Based Leadership)

**動機づけ:**
- Ryan, R.M. & Deci, E.L. (2000). "Self-Determination Theory and the Facilitation of Intrinsic Motivation." *American Psychologist*, 55(1), 68-78.

**ガバナンス:**
- Ostrom, E. (1990). *Governing the Commons.* Cambridge University Press.
- Argyris, C. (1977). "Double Loop Learning in Organizations." *HBR*, 55(5), 115-125.

### 複雑系科学・マルチエージェントシステム

**MAS Coordination:**
- Smith, R.G. (1980). "The Contract Net Protocol." *IEEE Trans. Computers*, C-29(12), 1104-1113.
- Rao, A.S. & Georgeff, M.P. (1995). "BDI Agents: From Theory to Practice." *ICMAS-95*.

**複雑適応系:**
- Holland, J.H. (1995). *Hidden Order.* Addison-Wesley.
- Kauffman, S.A. (1993). *The Origins of Order.* Oxford University Press.
- Csete, M.E. & Doyle, J.C. (2002). "Reverse Engineering of Biological Complexity." *Science*, 295(5560), 1664-1669.
- Carlson, J.M. & Doyle, J.C. (2002). "Complexity and Robustness." *PNAS*, 99(S1), 2538-2545.

**レジリエンスエンジニアリング:**
- Hollnagel, E., Woods, D.D. & Leveson, N. (Eds.) (2006). *Resilience Engineering.* Ashgate.
- Woods, D.D. (2015). "Four Concepts for Resilience." *RESS*, 141, 5-9.
- Woods, D.D. (2018). "The Theory of Graceful Extensibility." *ESD*, 38(4), 433-457.

**サイバネティクス:**
- Wiener, N. (1948). *Cybernetics.* MIT Press.
- Ashby, W.R. (1956). *An Introduction to Cybernetics.* Chapman and Hall.
- Beer, S. (1972). *Brain of the Firm.* Wiley. (Viable System Model)

**認知アーキテクチャ:**
- Laird, J.E., Lebiere, C. & Rosenbloom, P.S. (2017). "A Standard Model of the Mind." *AI Magazine*, 38(4), 13-26.
- Boyd, J. (1986). "Patterns of Conflict." (OODA Loop)

**一般システム理論:**
- von Bertalanffy, L. (1968). *General System Theory.* George Braziller.
- Maturana, H. & Varela, F. (1980). *Autopoiesis and Cognition.* D. Reidel.

---

## 3. 批判的考察

### 注意すべき限界

1. **メタファーと実装の距離**: 認知科学の概念はメタファーとして活用されているが、「脳がこうだから組織もこうあるべき」は論理的に必然ではない。設計への「着想」と科学的「証明」の区別が重要。

2. **自我消耗の再現性問題**: Hagger et al. (2016) の大規模再現実験で ego depletion 効果は再現に失敗。ただし「認知負荷が判断の質を劣化させる」という広義の命題は堅固。

3. **SECI モデルの経験的裏付けの弱さ**: Bratianu (2010) が Externalization と Internalization のみが真の「変換」と指摘。

4. **Trust Score の定量化の限界**: 信頼を加重和の単一スコアに縮約することは学術的な信頼測定とは乖離する。実用的な近似としては合理的。

5. **「不変原理」の強さ**: 「invariant」は非常に強い主張。「繰り返し再発見されるロバストな設計原理」(recurrently rediscovered design principles) がより正確な表現。

6. **HOT理論のトレードオフ**: ロバスト性を一方向に最適化すると別方向の脆弱性が必然的に生じる。5つの原理すべてを同時に最大化できる保証はない。

7. **人間-AI間の信頼と人間同士の信頼の異質性**: AIにbenevolence（善意）を帰属させることの理論的妥当性は活発に議論中。

### 推奨される表現

学術的正確性を追求する場合:
- 「認知科学的に証明された設計」→「認知科学の知見に基づいた設計」(inspired by, not proven by)
- 「不変原理」→「繰り返し再発見されるロバストな設計原理」
- 「独立に同じ原理に到達した」→「共通の問題構造がスケール横断的に同じ設計パターンを要求する」
