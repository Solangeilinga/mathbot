-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : mar. 12 mai 2026 à 12:40
-- Version du serveur : 9.1.0
-- Version de PHP : 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `bepcmath`
--

-- --------------------------------------------------------

--
-- Structure de la table `conversation_history`
--

DROP TABLE IF EXISTS `conversation_history`;
CREATE TABLE IF NOT EXISTS `conversation_history` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` varchar(36) NOT NULL,
  `chapitre` varchar(100) NOT NULL,
  `role` enum('user','assistant') NOT NULL,
  `content` text NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=MyISAM AUTO_INCREMENT=184 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `conversation_history`
--

INSERT INTO `conversation_history` (`id`, `user_id`, `chapitre`, `role`, `content`, `created_at`) VALUES
(111, 'dev-user-id', 'Probabilités', 'assistant', 'Candide, imagine que tu es au marché de Ouaga, et que tu veux acheter des mangues. Il y a 6 mangues différentes, et tu veux en choisir une qui est mûre. Les mangues numérotées 1, 2 et 3 sont mûres, tandis que les mangues numérotées 4, 5 et 6 ne le sont pas.\n\nTu veux choisir une mangue mûre, donc tu as 3 choix (1, 2, 3) sur un total de 6 mangues. Pour calculer la probabilité de choisir une mangue mûre, tu divides le nombre de mangues mûres (3) par le nombre total de mangues (6).\n\nC\'est comme faire une fraction : 3/6. Et si tu simplifies cette fraction, tu obtiens 1/2. Cela signifie que tu as 1 chance sur 2 de choisir une mangue mûre.\n\nAlors, la probabilité de choisir une mangue mûre est de 1/2 ou 3/6.\n\n✓ Bonne réponse : B et D (car 1/2 = 3/6)\n\nMaintenant, imagine que tu es à la gare routière de Ouaga, et que tu attends un taxi. Il y a 6 taxis qui arrivent, et tu veux monter dans l\'un d\'eux. Quelle est la probabilité que le taxi que tu choisis soit le numéro 1, 2 ou 3 ?\n\nA. 1/3\nB. 1/2\nC. 2/3\nD. 3/6\n\nRéfléchis un peu, et je te donnerai la correction !', '2026-05-10 22:47:33'),
(110, 'dev-user-id', 'Probabilités', 'user', 'Je ne comprends pas, explique autrement avec un exemple simple du quotidien burkinabè', '2026-05-10 22:47:32'),
(109, 'dev-user-id', 'Probabilités', 'assistant', 'Candide, imagine que tu vas acheter des mangues au marché de Ouaga. Il y a 6 mangues dans un panier, et tu veux choisir une mangue parmi les 3 premières (1, 2, 3). Les 3 premières mangues sont les meilleures, et les 3 dernières (4, 5, 6) sont moins fraîches.\n\nTu as 3 chances de choisir une bonne mangue (1, 2, 3) sur 6 mangues au total. Pour calculer la probabilité de choisir une bonne mangue, tu divides le nombre de bonnes mangues (3) par le nombre total de mangues (6).\n\nC\'est comme partager un sac de mil entre 6 personnes, et que 3 d\'entre elles reçoivent une part. La probabilité que tu choisisses une bonne mangue est la même que la probabilité que tu reçoives une part de mil.\n\nLa réponse est donc :\nA. 1/3\nB. 1/2\nC. 2/3\nD. 3/6\n✓ Bonne réponse : B et D (car 1/2 = 3/6)\n\nComprends-tu mieux maintenant, Candide ?', '2026-05-10 22:45:05'),
(108, 'dev-user-id', 'Probabilités', 'user', 'Je ne comprends pas, explique autrement avec un exemple simple du quotidien burkinabè', '2026-05-10 22:45:04'),
(107, 'dev-user-id', 'Probabilités', 'assistant', 'Je suis désolé, mais l\'exercice que vous avez fourni concerne le calcul du plus grand commun diviseur (pgd) et non les probabilités. Cependant, je vais suivre le format demandé pour résoudre l\'exercice donné, en substituant le chapitre par le sujet approprié.\n\n📌 ANALYSE\nExercice de calcul du plus grand commun diviseur (pgd) et notion mathématique d\'arithmétique.\n\n📖 EXPLICATION\nPour calculer le pgd de deux nombres, on peut utiliser l\'algorithme d\'Euclide. Voici les étapes :\n1. Prendre les deux nombres donnés.\n2. Diviser le plus grand nombre par le plus petit nombre et trouver le reste.\n3. Remplacer le plus grand nombre par le plus petit nombre et le plus petit nombre par le reste.\n4. Répéter les étapes 2 et 3 jusqu\'à ce que le reste soit 0.\n5. Le pgd est le dernier reste non nul.\n\n✅ SOLUTION\nCalculons le pgd de 69 309 et 11 322 en utilisant l\'algorithme d\'Euclide :\n- 69 309 = 11 322 * 6 + 147\n- 11 322 = 147 * 77 + 3\n- 147 = 3 * 49 + 0\n\nLe pgd est donc 3.\n\n🎯 ENTRAÎNE-TOI !\nExercice 1 : Quel est le plus grand commun diviseur de 24 et 30 ?\nA. 1\nB. 2\nC. 3\nD. 6\n✓ Bonne réponse : D\n\nExercice 2 : Quel est le plus grand commun diviseur de 48 et 18 ?\nA. 1\nB. 2\nC. 3\nD. 6\n✓ Bonne réponse : D\n\nN\'oubliez pas de pratiquer régulièrement pour améliorer vos compétences en mathématiques ! Je suis là pour vous aider et vous encourager.', '2026-05-10 22:44:30'),
(106, 'dev-user-id', 'Probabilités', 'user', '[Exercice soumis] : Cal uler le plus grand ommun diviseur (pgd) de 69 309 et 11 322.', '2026-05-10 22:44:30'),
(105, 'dev-user-id', 'Probabilités', 'assistant', 'Bonjour Candide ! Comment vas-tu aujourd\'hui ? Prêt à plonger à nouveau dans les probabilités ? Nous pouvons réviser un point précis, faire des exercices ou explorer une nouvelle notion. Qu\'est-ce que tu choisis ?', '2026-05-10 22:43:37'),
(104, 'dev-user-id', 'Probabilités', 'user', 'bonjour', '2026-05-10 22:43:36'),
(103, 'dev-user-id', 'Probabilités', 'assistant', '📌 ANALYSE\nL\'exercice consiste à déterminer si deux nombres, 69 309 et 11 322, sont premiers entre eux, c\'est-à-dire s\'ils n\'ont pas de diviseur commun autre que 1. La notion mathématique impliquée est le plus grand diviseur commun (PGCD) de deux nombres.\n\n📖 EXPLICATION\nPour résoudre ce problème, nous allons utiliser l\'algorithme d\'Euclide pour calculer le PGCD de 69 309 et 11 322. Voici les étapes :\n1. Diviser le plus grand nombre par le plus petit nombre et trouver le reste.\n2. Remplacer le plus grand nombre par le plus petit nombre et le plus petit nombre par le reste.\n3. Répéter les étapes 1 et 2 jusqu\'à ce que le reste soit 0.\n4. Le PGCD est le dernier reste non nul.\n\n✅ SOLUTION\nCalculons le PGCD de 69 309 et 11 322 :\n1. 69 309 = 11 322 × 6 + 1 071\n2. 11 322 = 1 071 × 10 + 512\n3. 1 071 = 512 × 2 + 47\n4. 512 = 47 × 10 + 42\n5. 47 = 42 × 1 + 5\n6. 42 = 5 × 8 + 2\n7. 5 = 2 × 2 + 1\n8. 2 = 1 × 2 + 0\n\nLe PGCD de 69 309 et 11 322 est 1. Puisque le PGCD est 1, les nombres 69 309 et 11 322 sont premiers entre eux.\n\n🎯 ENTRAÎNE-TOI !\nExercice 1 : Les nombres 24 et 30 sont-ils premiers entre eux ?\nA. Oui, car leur PGCD est 1\nB. Oui, car leur PGCD est 6\nC. Non, car leur PGCD est 2\nD. Non, car leur PGCD est 6\n✓ Bonne réponse : D. Non, car leur PGCD est 6\n\nExercice 2 : Quel est le PGCD de 48 et 18 ?\nA. 2\nB. 3\nC. 6\nD. 12\n✓ Bonne réponse : C. 6', '2026-05-10 22:17:36'),
(102, 'dev-user-id', 'Probabilités', 'user', '[Exercice soumis] : Les nombres 69 309 et 11 322 sont-ils premiers entre eux?\n◮2. Calculer le plus grand ommun diviseur (pgd) de 69 309 et 11 322', '2026-05-10 22:17:36'),
(101, 'dev-user-id', 'Probabilités', 'assistant', 'Il semble que vous n\'avez pas fourni l\'exercice à analyser. Veuillez me fournir l\'exercice concerné, et je serai ravi de vous aider !\n\nDès que vous me fournirez l\'exercice, je pourrai :\n\n📌 ANALYSE\n[Identifie le type d\'exercice et la notion]\n\n📖 EXPLICATION\n[Explique la méthode pas à pas]\n\n✅ SOLUTION\n[Résolution complète avec calculs]\n\n🎯 ENTRAÎNE-TOI !\nExercice 1 : [énoncé]\nA. [option]\nB. [option]\nC. [option]\nD. [option]\n✓ Bonne réponse : [lettre]\n\nExercice 2 : [énoncé]\nA. [option]\nB. [option]\nC. [option]\nD. [option]\n✓ Bonne réponse : [lettre]\n\nN\'hésitez pas à me fournir l\'exercice, et nous allons commencer ensemble !', '2026-05-10 22:14:48'),
(100, 'dev-user-id', 'Probabilités', 'user', '[Exercice soumis] : bonjour', '2026-05-10 22:14:48'),
(98, 'dev-user-id', 'Probabilités', 'user', 'Bon.', '2026-05-10 20:27:26'),
(99, 'dev-user-id', 'Probabilités', 'assistant', 'Super, Candide ! On va continuer avec un nouvel exercice. Imagine que tu es à la loterie nationale du Burkina Faso, et que tu achètes un billet pour le tirage du jackpot. Il y a 10 billets en compétition, et il n\'y a qu\'un seul gagnant.\n\nQuelle est la probabilité de gagner le jackpot ?\n\nA. 1/5\nB. 1/10\nC. 2/10\nD. 5/10\n\nRéfléchis un peu, et je te donnerai la correction !', '2026-05-10 20:27:27'),
(97, 'dev-user-id', 'Probabilités', 'assistant', 'Candide, imagine que tu es au marché de Ouaga, et que tu veux acheter un sac de riz parmi 6 sacs différents. Les sacs sont numérotés de 1 à 6. Tu veux choisir un sac dont le numéro est inférieur à 4, c\'est-à-dire les sacs numérotés 1, 2 ou 3.\n\nC\'est comme jouer à une loterie, où tu as 3 chances de gagner (les sacs 1, 2, 3) sur un total de 6 possibilités (les sacs 1, 2, 3, 4, 5, 6).\n\nPour calculer la probabilité de choisir un sac gagnant, tu divides le nombre de chances de gagner (3) par le nombre total de possibilités (6). C\'est comme faire une fraction : 3/6.\n\nEt si tu simplifies cette fraction, tu obtiens 1/2. Cela signifie que tu as 1 chance sur 2 de choisir un sac dont le numéro est inférieur à 4.\n\nAlors, la probabilité est de 1/2 ou 3/6. Voici les options :\nA. 1/3\nB. 1/2\nC. 2/3\nD. 3/6\n\n✓ Bonne réponse : B et D (car 1/2 = 3/6)\n\nN\'aie pas peur de demander si tu as encore des questions, Candide ! Je suis là pour t\'aider.', '2026-05-10 20:25:39'),
(96, 'dev-user-id', 'Probabilités', 'user', 'Je ne comprends pas, explique autrement avec un exemple simple du quotidien burkinabè', '2026-05-10 20:25:37'),
(94, 'dev-user-id', 'Probabilités', 'user', 'oui bonjour', '2026-05-10 20:23:54'),
(95, 'dev-user-id', 'Probabilités', 'assistant', 'Bonjour Candide ! Je suis ravi de te voir motivé pour continuer. Nous allons explorer d\'autres problèmes de probabilités ensemble. Voici un nouveau défi :\n\nUn sac contient 5 balles rouges et 3 balles bleues. Quelle est la probabilité de tirer une balle bleue ?\n\nA. 1/4\nB. 1/3\nC. 3/8\nD. 2/5\n\nRéfléchis un peu, et je te donnerai la correction !', '2026-05-10 20:23:59'),
(93, 'dev-user-id', 'Probabilités', 'assistant', 'Ne t\'inquiète pas, Candide ! Tu as fait un excellent travail en essayant de résoudre le problème. L\'erreur est simplement due à une mauvaise comptage des chances.\n\nTu as 3 taxis qui correspondent à ta demande (1, 2, 3) sur un total de 6 taxis (1, 2, 3, 4, 5, 6). Pour calculer la probabilité, tu divides le nombre de taxis que tu veux (3) par le nombre total de taxis (6).\n\nC\'est comme faire une fraction : 3/6. Et si tu simplifies cette fraction, tu obtiens 1/2. Pas 2/3, car 2/3 équivaudrait à 4 taxis sur 6, ce qui n\'est pas le cas ici.\n\nAlors, la bonne réponse est :\n✓ Bonne réponse : B et D (car 1/2 = 3/6)\n\nContinue comme ça, Candide ! Tu es sur la bonne voie. N\'aie pas peur de faire des erreurs, car c\'est ainsi que l\'on apprend. Et rappelle-toi, la pratique fait la perfection ! Qu\'est-ce que tu dis de passer à la suite ?', '2026-05-10 18:52:07'),
(92, 'dev-user-id', 'Probabilités', 'user', 'Réponse \"C. 2/3\" incorrecte Candide. Explique l\'erreur gentiment, donne la bonne réponse pas-à-pas et encourage à continuer.', '2026-05-10 18:52:06'),
(90, 'dev-user-id', 'Probabilités', 'user', 'Je ne comprends pas, explique autrement avec un exemple simple du quotidien burkinabè', '2026-05-10 18:51:54'),
(91, 'dev-user-id', 'Probabilités', 'assistant', 'Candide, imagine que tu es à la gare routière de Ouaga, et que tu attends un taxi pour aller chez toi. Il y a 6 taxis qui arrivent, et ils sont numérotés de 1 à 6. Tu veux monter dans un taxi dont le numéro est inférieur à 4, c\'est-à-dire les taxis numérotés 1, 2 ou 3.\n\nIl y a 3 taxis qui correspondent à ta demande (1, 2, 3) sur un total de 6 taxis (1, 2, 3, 4, 5, 6). Pour calculer la probabilité de monter dans l\'un de ces 3 taxis, tu divides le nombre de taxis que tu veux (3) par le nombre total de taxis (6).\n\nC\'est comme faire une fraction : 3/6. Mais tu peux simplifier cette fraction en la divisant par 3, ce qui te donne 1/2.\n\nAlors, la probabilité de monter dans un taxi dont le numéro est inférieur à 4 est de 1/2 ou 3/6.\n\nLa bonne réponse est :\nA. 1/3\nB. 1/2\nC. 2/3\nD. 3/6\n✓ Bonne réponse : B et D (car 1/2 = 3/6)', '2026-05-10 18:51:55'),
(88, 'dev-user-id', 'Probabilités', 'user', 'Je ne comprends pas, explique autrement avec un exemple simple du quotidien burkinabè', '2026-05-10 18:50:36'),
(89, 'dev-user-id', 'Probabilités', 'assistant', 'Candide, imagine que tu vas au marché de Ouaga pour acheter des tomates. Il y a 6 tomates différentes, numérotées de 1 à 6. Tu veux choisir une tomate dont le numéro est inférieur à 4, c\'est-à-dire les tomates numérotées 1, 2 ou 3.\n\nLa probabilité de choisir l\'une de ces tomates est le nombre de tomates que tu veux (3) divisé par le nombre total de tomates (6).\n\nTu as 3 chances de choisir la bonne tomate sur 6 possibilités. C\'est comme lorsqu\'on lance un dé, on a 3 issues favorables (1, 2, 3) sur 6 issues possibles (1, 2, 3, 4, 5, 6).\n\nMaintenant, calcule la probabilité en divisant le nombre de chances (3) par le nombre total de possibilités (6). Quelle est la réponse ?\n\nA. 1/3\nB. 1/2\nC. 2/3\nD. 1/2 ou 3/6\n\nRéfléchis, et je te donne la correction !', '2026-05-10 18:50:37'),
(87, 'dev-user-id', 'Probabilités', 'assistant', 'Candide, voici un nouvel exercice pour toi :\n\nUn jeu de dés comporte 6 faces numérotées de 1 à 6. Quelle est la probabilité d\'obtenir un nombre inférieur à 4 en lançant ce dé ?\n\nA. 1/3\nB. 1/2\nC. 2/3\nD. 3/6\n\nRéfléchis un peu, et je te donnerai la correction !', '2026-05-10 18:50:28'),
(82, 'dev-user-id', 'Probabilités', 'assistant', 'Salut Candide, on se retrouve ! Comment vas-tu aujourd\'hui ? En forme pour replonger dans les probabilités ? On peut réviser les bases, faire des exercices ou revoir un point précis, comme tu veux !', '2026-05-10 17:31:21'),
(83, 'dev-user-id', 'Probabilités', 'assistant', 'Bonne après-midi Candide ! Heureux de te retrouver ! Comment vas-tu ? Es-tu en forme ? On peut réviser les probabilités, faire des exercices ou revoir un point précis, comme tu veux !', '2026-05-10 17:33:09'),
(84, 'dev-user-id', 'Probabilités', 'assistant', 'Bonjour Candide ! Comment vas-tu ce jour ? Tu es en forme ? On reprend les probabilités ! On peut réviser, faire des exercices ou revoir un point précis, chose que tu préfères ?', '2026-05-10 17:43:56'),
(85, 'dev-user-id', 'Probabilités', 'assistant', 'Bonne après-midi Candide ! Très heureux de te retrouver ! Comment vas-tu ? Es-tu en forme ? On peut réviser les fondamentaux, faire des exercices ou revoir un point précis, comme tu le souhaites !', '2026-05-10 17:44:46'),
(86, 'dev-user-id', 'Probabilités', 'user', 'Donne-moi un nouvel exercice BEPC varié avec 4 options A B C D', '2026-05-10 18:50:26'),
(81, 'dev-user-id', 'Algèbre', 'assistant', 'Salut Candide ! Je suis MathBot, ton tuteur de maths. Comment te sens-tu aujourd\'hui ? On peut commencer par une explication d\'algèbre ou plonger directement dans un exercice, comme tu le souhaites, Candide !', '2026-05-10 16:44:30'),
(80, 'dev-user-id', 'Probabilités', 'assistant', 'Bonjour undefined ! Quelle joie de te revoir ! Comment vas-tu aujourd\'hui ? Es-tu en forme pour plonger dans les probabilités ? Nous pouvons réviser une notion, faire des exercices ou revoir un point difficile, quel est ton choix ?', '2026-05-10 16:24:45'),
(78, 'dev-user-id', 'Géométrie', 'assistant', 'Hey soleil de Ouaga ! Je suis MathBot, ton tuteur mathématique. Comment vas-tu aujourd\'hui ? On va explorer la géométrie ensemble ! Veux-tu commencer par une explication ou un exercice ?', '2026-05-10 16:20:53'),
(79, 'dev-user-id', 'Probabilités', 'assistant', 'Bonne après-midi undefined ! Quel plaisir de te revoir ! Comment vas-tu ? Es-tu en forme pour travailler ? On peut réviser les définitions, faire des exercices ou revoir un point difficile, qu\'est-ce que tu choisis ?', '2026-05-10 16:24:24'),
(77, 'dev-user-id', 'Géométrie', 'assistant', 'Bonne après-midi, que le soleil de Ouaga éclaire notre apprentissage ! Je suis MathBot, ton tuteur. Comment vas-tu aujourd\'hui ? Nous allons explorer la Géométrie ensemble ! Préfères-tu commencer par une explication ou un exercice ?', '2026-05-10 16:20:46'),
(75, 'dev-user-id', 'Probabilités', 'user', 'Réponse \"B. 1/2\" incorrecte. Explique gentiment l\'erreur, donne la correction pas-à-pas, encourage à continuer.', '2026-05-10 16:18:54'),
(76, 'dev-user-id', 'Probabilités', 'assistant', 'Ne t\'inquiète pas, c\'est tout à fait normal ! Analysons la question ensemble. Nous avons les numéros 1, 2, 3 et 4. Les numéros pairs sont 2 et 4, soit 2 numéros pairs sur 4 numéros au total.\n\nPour calculer la probabilité, on divise le nombre de résultats favorables (numéros pairs) par le nombre total de résultats possibles. Donc, la probabilité d\'obtenir un numéro pair est de 2/4, ce qui peut être simplifié en 1/2.\n\nMais attends, cette réponse est justement celle que tu as choisie ! Le problème, c\'est que la question demande la réponse sous forme de fraction, et il y a une autre façon d\'écrire 1/2 qui correspond à l\'une des options.\n\nLa bonne réponse est en effet B. 1/2, mais elle est également égale à D. 2/4, puisque 2/4 = 1/2. Alors, les deux réponses B et D sont correctes, mais comme il n\'y a qu\'une seule bonne réponse possible, on va choisir celle qui est déjà simplifiée, qui est B. 1/2.\n\nNe te décourage pas, tu as fait un excellent travail ! Tu as réfléchi logiquement et tu as choisi une réponse qui est mathématiquement correcte. Continue comme ça, et tu vas devenir un expert en probabilités en un rien de temps ! Qu\'est-ce que tu dis de passer à la suite ?', '2026-05-10 16:18:56'),
(72, 'dev-user-id', 'Probabilités', 'assistant', 'Hey super-élève ! Je suis MathBot, ton tuteur. Comment vas-tu aujourd\'hui ? Nous allons explorer les probabilités ensemble ! Explication ou exercice, qu\'est-ce que tu préfères ?', '2026-05-10 16:16:17'),
(73, 'dev-user-id', 'Probabilités', 'user', 'je préfère des explications', '2026-05-10 16:16:46'),
(74, 'dev-user-id', 'Probabilités', 'assistant', 'Parfait, je vais t\'expliquer les probabilités de façon simple ! La probabilité, c\'est comme deviner la chance qu\'il pleuve demain à Ouaga. On utilise un nombre entre 0 et 1 pour mesurer cette chance. Si la probabilité est proche de 0, c\'est peu probable, et si elle est proche de 1, c\'est très probable.\n\nImagine que tu tires une pièce de monnaie à 100 CFA. Il y a deux issues possibles : face ou pile. La probabilité d\'obtenir face est de 1/2, car il n\'y a que deux résultats possibles et ils sont égaux.\n\nVoici un exemple pour bien comprendre : \nQuestion : Quelle est la probabilité d\'obtenir un numéro pair en tirant un numéro entre 1 et 4 ?\nA. 1/4\nB. 1/2\nC. 3/4\nD. 2/4\nRéfléchis un peu, et je te donnerai la correction !', '2026-05-10 16:16:48'),
(112, 'dev-user-id', 'Probabilités', 'user', 'bonjour', '2026-05-10 22:48:12'),
(113, 'dev-user-id', 'Probabilités', 'assistant', 'Bonjour Candide ! Comment vas-tu aujourd\'hui ? Prêt à plonger à nouveau dans les probabilités ? On peut réviser, faire des exercices ou revoir un point précis, comme tu veux !\n\nVoici un nouvel exercice pour toi :\n\nUn sac contient 5 noix de cola et 3 noix de pécan. Quelle est la probabilité de tirer une noix de cola en premier ?\n\nA. 3/8\nB. 5/8\nC. 1/2\nD. 2/5\n\nRéfléchis un peu, et je te donnerai la correction !', '2026-05-10 22:48:13'),
(114, 'dev-user-id', 'Probabilités', 'user', '[Exercice soumis] : Calculer le plus grand ommun diviseur (pgd) de 69 309 et 11 322.', '2026-05-10 22:50:14'),
(115, 'dev-user-id', 'Probabilités', 'assistant', '📌 ANALYSE\nExercice de calcul du plus grand commun diviseur (pgcd) de deux nombres, notion mathématique de théorie des nombres.\n\n📖 EXPLICATION\nPour calculer le pgcd de deux nombres, on peut utiliser l\'algorithme d\'Euclide. Voici les étapes :\n1. Prendre les deux nombres et diviser le plus grand par le plus petit.\n2. Prendre le reste de la division et le plus petit nombre.\n3. Répéter les étapes 1 et 2 jusqu\'à ce que le reste soit nul.\n4. Le pgcd est le dernier reste non nul.\n\n✅ SOLUTION\nCalculons le pgcd de 69 309 et 11 322 :\n1. 69 309 ÷ 11 322 = 6 reste 2 307\n2. 11 322 ÷ 2 307 = 4 reste 2 502\n3. 2 307 ÷ 2 502 = 0 reste 2 307 (erreur de calcul, on prend le plus petit et le reste)\n4. 2 502 ÷ 2 307 = 1 reste 195\n5. 2 307 ÷ 195 = 11 reste 122\n6. 195 ÷ 122 = 1 reste 73\n7. 122 ÷ 73 = 1 reste 49\n8. 73 ÷ 49 = 1 reste 24\n9. 49 ÷ 24 = 2 reste 1\n10. 24 ÷ 1 = 24 reste 0\nLe pgcd de 69 309 et 11 322 est 1.\n\n🎯 ENTRAÎNE-TOI !\nExercice 1 : Calculer le pgcd de 48 et 18.\nA. 1\nB. 2\nC. 3\nD. 6\n✓ Bonne réponse : D\n\nExercice 2 : Calculer le pgcd de 25 et 15.\nA. 1\nB. 3\nC. 5\nD. 10\n✓ Bonne réponse : C', '2026-05-10 22:50:14'),
(116, 'dev-user-id', 'Probabilités', 'user', 'bonjour', '2026-05-10 22:52:29'),
(117, 'dev-user-id', 'Probabilités', 'assistant', 'Bonjour Candide ! Comment vas-tu aujourd\'hui ? Es-tu prêt à continuer l\'aventure des probabilités ? On peut faire un nouvel exercice, réviser un point précis ou simplement discuter des dernières découvertes. Qu\'est-ce que tu choisis ?', '2026-05-10 22:52:30'),
(118, 'dev-user-id', 'Probabilités', 'user', 'Je ne comprends pas, explique autrement avec un exemple simple du quotidien burkinabè', '2026-05-10 22:52:40'),
(119, 'dev-user-id', 'Probabilités', 'assistant', 'Candide, imagine que tu es au marché de Ouaga, et que tu veux acheter des cacahuètes. Il y a 6 sacs de cacahuètes, et tu veux choisir un sac qui contient moins de 4 kilos de cacahuètes. Les sacs sont numérotés de 1 à 6, et les poids sont :\n\n* Sac 1 : 1 kilo\n* Sac 2 : 2 kilos\n* Sac 3 : 3 kilos\n* Sac 4 : 4 kilos\n* Sac 5 : 5 kilos\n* Sac 6 : 6 kilos\n\nTu veux choisir un sac qui contient moins de 4 kilos de cacahuètes, donc tu peux choisir les sacs 1, 2 ou 3.\n\nLa probabilité de choisir l\'un de ces sacs est le nombre de sacs que tu veux (3) divisé par le nombre total de sacs (6). C\'est comme faire une fraction : 3/6, qui équivaut à 1/2.\n\nAlors, la probabilité de choisir un sac qui contient moins de 4 kilos de cacahuètes est de 1/2.\n\nLa bonne réponse est :\n✓ Bonne réponse : B et D (car 1/2 = 3/6)\n\nComprends-tu mieux maintenant, Candide ?', '2026-05-10 22:52:41'),
(120, 'dev-user-id', 'Probabilités', 'user', 'Donne-moi un nouvel exercice BEPC varié avec 4 options A B C D', '2026-05-10 23:12:50'),
(121, 'dev-user-id', 'Probabilités', 'assistant', 'Bonjour Candide ! Voici un nouvel exercice pour toi :\n\nUn sac contient 12 boules de couleur différente : 4 boules rouges, 4 boules bleues et 4 boules vertes. Quelle est la probabilité de tirer une boule bleue ?\n\nA. 1/3\nB. 1/4\nC. 1/6\nD. 2/3\n\nRéfléchis un peu, et je te donnerai la correction !\n\n(Pense à la proportion de boules bleues par rapport au total de boules dans le sac)', '2026-05-10 23:12:51'),
(122, 'dev-user-id', 'Géométrie', 'user', 'Je ne comprends pas, explique autrement avec un exemple simple du quotidien burkinabè', '2026-05-10 23:27:10'),
(123, 'dev-user-id', 'Géométrie', 'assistant', 'Candide, imagine que tu es au marché de Ouaga et que tu veux acheter un morceau de tissu pour faire une robe. Le vendeur te dit que le tissu fait 5 mètres de longueur et 2 mètres de largeur. Quelle est la surface du tissu ?\n\nA. 5 m²\nB. 7 m²\nC. 10 m²\nD. 12 m²\n\nRéfléchis un peu, et on verra ensemble si tu as raison !', '2026-05-10 23:27:11'),
(124, 'dev-user-id', 'Géométrie', 'user', 'Donne-moi un nouvel exercice BEPC varié avec 4 options A B C D', '2026-05-10 23:27:59'),
(125, 'dev-user-id', 'Géométrie', 'assistant', 'Candide, voici un nouvel exercice pour toi ! Un fermier a un champ en forme de triangle rectangles, avec une base de 10 mètres et une hauteur de 8 mètres. Quelle est l\'aire de ce champ ?\n\nA. 40 m²\nB. 60 m²\nC. 80 m²\nD. 100 m²\n\nPrends ton temps, Candide, et essaye de trouver la bonne réponse !', '2026-05-10 23:28:00'),
(126, 'dev-user-id', 'Géométrie', 'user', 'Je veux revoir les bases du chapitre depuis le début, étape par étape', '2026-05-10 23:28:24'),
(127, 'dev-user-id', 'Géométrie', 'assistant', 'Candide, on va revoir les bases de la géométrie depuis le début ! Commençons par les points et les droites. Un point est une position dans l\'espace, et une droite est un ensemble de points qui s\'étendent à l\'infini dans les deux sens.\n\nImagine que tu es sur un terrain de football à Ouaga, et que tu dessines une ligne sur le sol avec un bâton. Cette ligne représente une droite.\n\nMaintenant, voici un exercice simple pour commencer :\n\nQu\'est-ce qu\'un point en géométrie ?\n\nA. Une ligne qui s\'étend à l\'infini\nB. Un ensemble de lignes qui se croisent\nC. Une position dans l\'espace\nD. Un cercle qui tourne autour d\'un centre\n\nRéfléchis, Candide, et on verra ensemble si tu as raison !', '2026-05-10 23:28:26'),
(128, 'dev-user-id', 'Géométrie', 'user', 'Réponse \"C. 80 m²\" incorrecte Candide. Explique gentiment l\'erreur, donne la correction pas-à-pas et encourage.', '2026-05-10 23:29:41'),
(129, 'dev-user-id', 'Géométrie', 'assistant', 'Candide, ne t\'inquiète pas, c\'est tout à fait normal de faire des erreurs ! On va revoir ensemble pourquoi ta réponse n\'est pas correcte.\n\nL\'exercice était : un fermier a un champ en forme de triangle rectangles, avec une base de 10 mètres et une hauteur de 8 mètres. Quelle est l\'aire de ce champ ?\n\nTu as répondu C. 80 m², mais malheureusement, ce n\'est pas correct. Pour trouver l\'aire d\'un triangle rectangles, on utilise la formule : aire = (base × hauteur) / 2.\n\nAlors, on calcule : aire = (10 × 8) / 2 = 80 / 2 = 40 m².\n\nDonc, la bonne réponse est A. 40 m².\n\n✓ Bonne réponse : A\n\nNe te décourage pas, Candide ! Tu as fait un bon effort, et maintenant, tu sais comment calculer l\'aire d\'un triangle rectangles. Continue comme ça, et tu seras un expert en géométrie en un rien de temps ! On passe à l\'exercice suivant ?', '2026-05-10 23:29:42'),
(130, 'dev-user-id', 'Géométrie', 'user', 'pourquoi tu parles plus', '2026-05-10 23:32:26'),
(131, 'dev-user-id', 'Géométrie', 'assistant', 'Désolé Candide ! Je vais être plus bref. Voici la correction :\n\nL\'exercice était : un champ en forme de triangle rectangles, avec une base de 10 mètres et une hauteur de 8 mètres. Quelle est l\'aire de ce champ ?\n\nTu as répondu C. 80 m², mais la bonne réponse est A. 40 m², car aire = (base × hauteur) / 2 = (10 × 8) / 2 = 40 m².\n\n✓ Bonne réponse : A\n\nContinue comme ça, Candide ! On passe à l\'exercice suivant ?', '2026-05-10 23:32:27'),
(132, 'dev-user-id', 'Mixte', 'assistant', 'Bonjour Candide ! Belle journée pour démarrer notre aventure mathématique ensemble ! Je suis MathBot, ton tuteur de maths. Comment te sens-tu aujourd\'hui ? On commence par une explication de \"Mixte\" ou directement par un exercice, comme tu préfères, Candide !', '2026-05-11 00:00:10'),
(133, 'dev-user-id', 'Mixte', 'assistant', 'Bon matin Candide ! Je suis MathBot, ton tuteur de maths. Comment te sens-tu aujourd\'hui ? On commence par une explication de \"Mixte\" ou directement un exercice ?', '2026-05-11 00:00:17'),
(134, 'dev-user-id', 'Mixte', 'user', 'Je ne comprends pas, explique autrement avec un exemple simple du quotidien burkinabè', '2026-05-11 00:00:33'),
(135, 'dev-user-id', 'Mixte', 'assistant', 'Pas de problème, Candide ! Imagine que tu vas au marché de Ouaga pour acheter un sac de mil et un sac de sorgho. Le vendeur t\'offre un sac qui contient les deux, c\'est-à-dire un mélange de mil et de sorgho. Ce mélange, c\'est ce qu\'on appelle un \"mixte\". Maintenant, pour t\'entraîner, voici un exercice :\n\nQuel est le pourcentage de mil dans un sac de 10 kg qui contient 3 kg de mil et 7 kg de sorgho ?\nA. 20%\nB. 30%\nC. 40%\nD. 50%', '2026-05-11 00:00:35'),
(136, 'dev-user-id', 'Probabilités', 'assistant', 'Bonjour Candide, comment vas-tu ce matin ? Prêt à plonger dans les probabilités ? Tu te sens en forme ? On peut réviser, faire des exercices ou revoir un point précis, comme tu veux !', '2026-05-11 00:06:14'),
(137, 'dev-user-id', 'Probabilités', 'user', 'Je ne comprends pas, explique autrement avec un exemple simple du quotidien burkinabè', '2026-05-11 00:06:40'),
(138, 'dev-user-id', 'Probabilités', 'assistant', 'Candide, imagine que tu es à la maison et que tu as un sac de noix de cola. Il y a 6 noix de cola dans le sac, et tu veux en choisir une qui est parmi les 3 premières que tu as achetées au marché de Ouaga.\n\nLes 3 premières noix de cola sont comme les numéros 1, 2 et 3. Les 3 autres noix de cola sont comme les numéros 4, 5 et 6.\n\nTu veux choisir une noix de cola parmi les 3 premières (1, 2, 3). Il y a 3 noix de cola qui correspondent à ta demande sur un total de 6 noix de cola.\n\nPour calculer la probabilité de choisir une de ces 3 noix de cola, tu fais une fraction : 3 (noix de cola que tu veux) / 6 (noix de cola au total).\n\nC\'est comme partager un bol de riz entre 6 personnes, et que 3 personnes veuillent une partie spécifique. La probabilité que tu choisisses une de ces 3 noix de cola est de 3/6, ce qui est égal à 1/2.\n\nAlors, la bonne réponse est :\n✓ Bonne réponse : B et D (car 1/2 = 3/6)\n\nComprends-tu mieux maintenant, Candide ?', '2026-05-11 00:06:41'),
(139, 'dev-user-id', 'Probabilités', 'assistant', 'Bon matin Candide, ravie de te retrouver ! Comment vas-tu ? Es-tu en forme ? On peut réviser les bases de probabilités, faire des exercices ou revoir un point précis, qu\'est-ce que tu choisis ?', '2026-05-11 06:38:11'),
(140, 'dev-user-id', 'Probabilités', 'user', 'Je ne comprends pas, explique autrement avec un exemple simple du quotidien burkinabè', '2026-05-11 06:38:49'),
(141, 'dev-user-id', 'Probabilités', 'assistant', 'Candide, imagine que tu es au marché de Ouaga, et que tu veux acheter des noix de karité. Il y a un sac qui contient 6 noix, et tu veux prendre une noix parmi les 3 premières (1, 2, 3).\n\nLa probabilité de prendre une de ces 3 noix est comme la chance de choisir une noix parmi les 6 noix totales. Tu as 3 noix qui te plaisent (1, 2, 3) sur un total de 6 noix (1, 2, 3, 4, 5, 6).\n\nPour calculer la probabilité, tu peux utiliser une fraction : 3 (noix qui te plaisent) / 6 (noix totales). C\'est comme diviser un gâteau en 6 parts, et prendre 3 parts.\n\nCette fraction, 3/6, peut être simplifiée en 1/2. C\'est comme si tu avais 1 chance sur 2 de prendre une noix qui te plaît.\n\nAlors, la probabilité de prendre une noix parmi les 3 premières est de 1/2.\n\nVoici l\'exercice à nouveau :\nQuelle est la probabilité de prendre une noix parmi les 3 premières ?\nA. 1/3\nB. 1/2\nC. 2/3\nD. 3/6\n\n✓ Bonne réponse : B et D (car 1/2 = 3/6)\n\nN\'hésite pas à me demander si tu as d\'autres questions, Candide !', '2026-05-11 06:38:50'),
(142, 'dev-user-id', 'Probabilités', 'assistant', 'Bon matin Candide ! Heureux de retrouver Candide aujourd\'hui ! Comment vas-tu ? Es-tu en forme ? On peut réviser les notions de base, faire des exercices ou revoir les événements aléatoires. Qu\'est-ce que tu choisis ?', '2026-05-11 06:39:37'),
(143, 'dev-user-id', 'Probabilités', 'user', 'Je ne comprends pas, explique autrement avec un exemple simple du quotidien burkinabè', '2026-05-11 07:00:26'),
(144, 'dev-user-id', 'Probabilités', 'assistant', 'Candide, imagine que tu es au marché de Ouaga, et que tu veux acheter des noix de kola. Il y a 6 sacs de noix de kola, et tu veux choisir un sac qui contient des noix de kola de bonne qualité. Les sacs sont numérotés de 1 à 6, et les sacs 1, 2 et 3 contiennent des noix de kola de bonne qualité.\n\nLa probabilité de choisir un sac de bonne qualité est le nombre de sacs de bonne qualité (3) divisé par le nombre total de sacs (6). C\'est comme faire une fraction : 3/6.\n\nPour simplifier cette fraction, tu peux diviser le numérateur (3) et le dénominateur (6) par leur plus grand diviseur commun, qui est 3. Alors, 3 divisé par 3 égale 1, et 6 divisé par 3 égale 2. Donc, la fraction 3/6 égale 1/2.\n\nC\'est comme si tu avais 1 chance sur 2 de choisir un sac de noix de kola de bonne qualité. La bonne réponse est donc :\nA. 1/3\nB. 1/2\nC. 2/3\nD. 3/6\n✓ Bonne réponse : B et D (car 1/2 = 3/6)\n\nN\'aie pas peur de demander des explications supplémentaires, Candide ! Je suis là pour t\'aider. Qu\'est-ce que tu dis de passer à la suite ?', '2026-05-11 07:00:27'),
(145, 'dev-user-id', 'Probabilités', 'assistant', 'Salut Candide ! Rebonjour ! Comment vas-tu ? Es-tu en forme ? Révisons ensemble, on peut faire des exercices ou revoir un point de probabilités qui te pose problème.', '2026-05-11 07:11:00'),
(146, 'dev-user-id', 'Probabilités', 'user', 'Je ne comprends pas, explique autrement avec un exemple simple du quotidien burkinabè', '2026-05-11 07:11:18'),
(147, 'dev-user-id', 'Probabilités', 'assistant', 'Candide, imagine que tu es à la maison et que tu as un sac de noix de kola contenant 6 noix. Tu veux choisir une noix qui se trouve dans la première moitié du sac, c\'est-à-dire l\'une des 3 premières noix.\n\nIl y a 3 noix qui correspondent à ta demande (les 3 premières) sur un total de 6 noix. Pour calculer la probabilité de choisir l\'une de ces 3 noix, tu divides le nombre de noix que tu veux (3) par le nombre total de noix (6).\n\nC\'est comme faire une fraction : 3/6. Et si tu simplifies cette fraction, tu obtiens 1/2. Cela signifie que tu as 1 chance sur 2 de choisir l\'une des 3 premières noix.\n\nAlors, la probabilité de choisir une noix qui se trouve dans la première moitié du sac est de 1/2 ou 3/6.\n\nLa bonne réponse est :\nA. 1/3\nB. 1/2\nC. 2/3\nD. 3/6\n✓ Bonne réponse : B et D (car 1/2 = 3/6)\n\nNe t\'inquiète pas si tu ne comprends pas tout de suite, Candide. Prends ton temps et réfléchis-y. Tu es sur la bonne voie ! Qu\'est-ce que tu dis de passer à la suite ?', '2026-05-11 07:11:20'),
(148, 'dev-user-id', 'Probabilités', 'assistant', 'Bonne journée, Candide ! Comment vas-tu ? En forme pour aborder les probabilités ? On peut réviser les bases, faire des exercices ou revoir un point précis, comme tu veux !', '2026-05-11 07:37:58'),
(149, 'dev-user-id', 'Probabilités', 'user', 'Donne-moi un indice sans donner la réponse directement', '2026-05-11 07:38:42'),
(150, 'dev-user-id', 'Probabilités', 'assistant', 'Candide, pour résoudre ce problème, pense à la fraction 3/6. Tu peux la simplifier en divisant à la fois le numérateur (3) et le dénominateur (6) par leur plus grand diviseur commun, qui est... 3 ! Qu\'est-ce que tu obtiens lorsque tu fais cela ? Réfléchis un peu, et je te donnerai un autre indice si tu en as besoin !', '2026-05-11 07:38:43'),
(151, 'dev-user-id', 'Probabilités', 'assistant', 'Bonne journée, Candide ! Comment vas-tu ? En forme pour aborder les probabilités ? On peut réviser une notion, faire des exercices ou revoir un point précis, comme tu préfères !', '2026-05-11 07:48:12'),
(152, 'dev-user-id', 'Probabilités', 'user', 'Je veux revoir les bases du chapitre depuis le début, étape par étape', '2026-05-11 07:48:36'),
(153, 'dev-user-id', 'Probabilités', 'assistant', 'Très bien, Candide ! Nous allons revoir les bases du chapitre sur les probabilités étape par étape.\n\n**Étape 1 : Définition de la probabilité**\nLa probabilité est une mesure de la chance qu\'un événement se produise. Elle est représentée par un nombre entre 0 et 1.\n\n**Étape 2 : Exemple simple**\nImagine que tu tires une pièce de monnaie. Il y a deux issues possibles : face ou pile. La probabilité d\'obtenir face est de 1/2, car il n\'y a que deux résultats possibles et ils sont égaux.\n\n**Étape 3 : Calcul de la probabilité**\nLa probabilité est calculée en divisant le nombre de résultats favorables par le nombre total de résultats possibles.\n\nExemple : Un dé comporte 6 faces numérotées de 1 à 6. Quelle est la probabilité d\'obtenir un nombre pair ?\n\nIl y a 3 résultats favorables (2, 4, 6) sur 6 résultats possibles. La probabilité est donc de 3/6, ce qui équivaut à 1/2.\n\n**Étape 4 : Interprétation de la probabilité**\nLa probabilité peut être interprétée de différentes manières :\n\n* Une probabilité de 0 signifie que l\'événement est impossible.\n* Une probabilité de 1 signifie que l\'événement est certain.\n* Une probabilité comprise entre 0 et 1 signifie que l\'événement est possible, mais pas certain.\n\nMaintenant, Candide, je voudrais savoir si tu as des questions sur ces étapes ou si tu es prêt à passer à la suite ?', '2026-05-11 07:48:37'),
(154, 'dev-user-id', 'Probabilités', 'assistant', 'Bonne journée de travail Candide ! Comment vas-tu ? Es-tu en forme pour aborder les probabilités ? On peut réviser les bases, faire des exercices ou revoir un point précis, comme tu veux !', '2026-05-11 07:52:54'),
(155, 'dev-user-id', 'Probabilités', 'user', 'Donne-moi un nouvel exercice BEPC varié avec 4 options A B C D', '2026-05-11 07:53:12'),
(156, 'dev-user-id', 'Probabilités', 'assistant', 'Candide, voici un nouvel exercice pour toi :\n\nUn sac contient 12 noix de macadamia, dont 4 sont brunes et 8 sont blanches. Quelle est la probabilité de tirer au hasard une noix de macadamia brune du sac ?\n\nA. 1/3\nB. 1/4\nC. 1/6\nD. 1/2\n\nRéfléchis un peu, et je te donnerai la correction ! Imagine que tu es au marché de Ouaga, et que tu veux acheter des noix de macadamia. Quelle est la chance de choisir une noix brune parmi les 12 noix ?', '2026-05-11 07:53:13'),
(157, 'dev-user-id', 'Probabilités', 'assistant', 'Bonne journée, Candide ! Comment vas-tu ? Es-tu en forme ? On peut réviser les probabilités, faire des exercices ou revoir un point précis, comme tu veux !', '2026-05-11 07:53:24'),
(158, 'dev-user-id', 'Probabilités', 'user', 'Je ne comprends pas, explique autrement avec un exemple simple du quotidien burkinabè', '2026-05-11 07:53:35'),
(159, 'dev-user-id', 'Probabilités', 'assistant', 'Candide, imagine que tu es au marché de Ouaga et que tu veux acheter des noix de kola. Il y a 6 calebasses de noix de kola, et tu veux choisir une calebasse qui contient moins de 4 noix. Il y a 3 calebasses qui contiennent moins de 4 noix : 1 noix, 2 noix et 3 noix.\n\nC\'est comme si tu avais 3 chances de choisir la bonne calebasse sur 6 calebasses au total. Pour calculer la probabilité, tu divides le nombre de calebasses que tu veux (3) par le nombre total de calebasses (6).\n\nC\'est comme faire une fraction : 3/6. Et si tu simplifies cette fraction, tu obtiens 1/2. C\'est comme si tu avais 50% de chances de choisir la bonne calebasse.\n\nAlors, la probabilité de choisir une calebasse qui contient moins de 4 noix est de 1/2 ou 3/6. La bonne réponse est :\n\nA. 1/3\nB. 1/2\nC. 2/3\nD. 3/6\n✓ Bonne réponse : B et D (car 1/2 = 3/6)\n\nN\'aie pas peur de demander si tu as des questions, Candide ! Je suis là pour t\'aider. Qu\'est-ce que tu dis de passer à la suite ?', '2026-05-11 07:53:36'),
(160, 'dev-user-id', 'Probabilités', 'assistant', 'Bonne rentrée Candide ! Comment vas-tu ? En forme pour aborder les probabilités ? Révisons une notion, faisons des exercices ou réexaminons un point précis ?', '2026-05-11 08:10:27'),
(161, 'dev-user-id', 'Probabilités', 'user', 'Donne-moi un nouvel exercice BEPC varié avec 4 options A B C D', '2026-05-11 08:10:36'),
(162, 'dev-user-id', 'Probabilités', 'assistant', 'Candide, voici un nouvel exercice pour toi :\n\nUn sac contient 12 billes de couleurs différentes : 4 billes rouges, 4 billes bleues et 4 billes vertes. Quelle est la probabilité de tirer une bille rouge ?\n\nA. 1/3\nB. 1/4\nC. 2/3\nD. 1/6\n\nRéfléchis un peu, et je te donnerai la correction !\n\n(Pense à la proportion de billes rouges par rapport au total de billes dans le sac)', '2026-05-11 08:10:37'),
(163, 'dev-user-id', 'Probabilités', 'assistant', 'Bonne journée ensoleillée à Ouaga, Candide ! Je suis ravi de te retrouver ! Comment vas-tu ? Es-tu en forme pour apprendre ? On peut réviser les bases, faire des exercices ou revoir les événements aléatoires. Qu\'est-ce que tu choisis ?', '2026-05-11 08:11:02'),
(164, 'dev-user-id', 'Probabilités', 'user', 'Je ne comprends pas, explique autrement avec un exemple simple du quotidien burkinabè', '2026-05-11 08:11:08'),
(165, 'dev-user-id', 'Probabilités', 'assistant', 'Candide, imagine que tu es chez toi, et que tu as un bol de riz avec 6 grains de mil dedans, numérotés de 1 à 6. Tu veux manger les grains de mil dont le numéro est inférieur à 4, c\'est-à-dire les grains numérotés 1, 2 ou 3.\n\nIl y a 3 grains de mil qui correspondent à ta demande (1, 2, 3) sur un total de 6 grains de mil (1, 2, 3, 4, 5, 6). Pour calculer la probabilité de choisir l\'un de ces 3 grains, tu divides le nombre de grains que tu veux (3) par le nombre total de grains (6).\n\nC\'est comme faire une fraction : 3/6. Et si tu simplifies cette fraction, tu obtiens 1/2. Cela signifie que tu as 1 chance sur 2 de choisir un grain de mil dont le numéro est inférieur à 4.\n\nAlors, la probabilité est de 1/2 ou 3/6. Et les réponses possibles sont :\nA. 1/3\nB. 1/2\nC. 2/3\nD. 3/6\n\nLa bonne réponse est :\n✓ Bonne réponse : B et D (car 1/2 = 3/6)\n\nComprends-tu mieux maintenant, Candide ?', '2026-05-11 08:11:09'),
(166, 'dev-user-id', 'Probabilités', 'user', '[Exercice soumis] : Factoriser chacune des expressions littérales suivantes :\nA=−(3x−8)×(−x+9)+(3x+3)×(−x+9)', '2026-05-11 08:11:35'),
(167, 'dev-user-id', 'Probabilités', 'assistant', 'Je suis désolé, mais il semble que l\'exercice donné ne concerne pas les probabilités, mais plutôt l\'algèbre. Je vais tout de même le résoudre en suivant le format demandé, mais je vais adapter le chapitre pour refléter le contenu de l\'exercice.\n\n📌 ANALYSE\nExercice d\'algèbre : factorisation d\'expressions littérales.\n\n📖 EXPLICATION\nPour factoriser l\'expression donnée, nous allons suivre les étapes suivantes :\n1. Distribuer les signes négatifs et les parenthèses.\n2. Utiliser la propriété distributive pour développer les expressions.\n3. Rechercher des termes communs pour factoriser.\n\n✅ SOLUTION\nL\'expression donnée est :\nA = -(3x - 8) × (-x + 9) + (3x + 3) × (-x + 9)\n\nTout d\'abord, distribuons les signes négatifs et les parenthèses :\nA = (8 - 3x) × (-x + 9) + (3x + 3) × (-x + 9)\n\nEnsuite, utilisons la propriété distributive pour développer les expressions :\nA = (8 - 3x) × (-x) + (8 - 3x) × 9 + (3x + 3) × (-x) + (3x + 3) × 9\nA = -8x + 3x^2 + 72 - 27x - 3x^2 - 3x + 27x + 27\nA = -8x + 72 - 27x - 3x + 27x + 27\n\nEn combinant les termes similaires, on obtient :\nA = -11x + 99\n\nMaintenant, nous pouvons factoriser l\'expression :\nA = -11(x - 9)\n\n🎯 ENTRAÎNE-TOI !\nExercice 1 : Factoriser l\'expression suivante :\nA = (2x + 5) × (x - 3) - (2x + 5) × (x - 2)\nA. 2x + 5\nB. 2x - 5\nC. (2x + 5)(x - 3 - x + 2)\nD. (2x + 5)(x - 3 + x - 2)\n✓ Bonne réponse : C\n\nExercice 2 : Factoriser l\'expression suivante :\nA = (x + 2) × (x - 4) + (x + 2) × (x + 1)\nA. x + 2\nB. x - 2\nC. (x + 2)(x - 4 + x + 1)\nD. (x + 2)(x - 4 - x - 1)\n✓ Bonne réponse : C', '2026-05-11 08:11:35'),
(168, 'dev-user-id', 'Probabilités', 'assistant', 'Bonjour Candide ! Quel plaisir de te revoir ! Comment vas-tu ? Es-tu en forme ? On peut réviser les probabilités, faire des exercices ou revoir un point spécifique, comme tu veux !', '2026-05-11 08:13:23'),
(169, 'dev-user-id', 'Probabilités', 'user', 'Je ne comprends pas, explique autrement avec un exemple simple du quotidien burkinabè', '2026-05-11 08:13:32'),
(170, 'dev-user-id', 'Probabilités', 'assistant', 'Candide, imagine que tu es à la maison et que tu veux manger un bol de riz au poulet. Tu as 6 bols de riz différents, et tu veux choisir un bol qui a été préparé par ta mère (bols numérotés 1, 2, 3) parmi les 6 bols disponibles (1, 2, 3, 4, 5, 6).\n\nTu as 3 bols qui te plaisent (1, 2, 3) sur un total de 6 bols. Pour calculer la chance de choisir l\'un de ces 3 bols, tu divides le nombre de bols que tu veux (3) par le nombre total de bols (6).\n\nC\'est comme faire une fraction : 3/6. Et si tu simplifies cette fraction, tu obtiens 1/2.\n\nPense à cela comme si tu lançais une pièce de monnaie : il y a 2 issus possibles (face ou pile), et tu as 1 chance sur 2 d\'obtenir l\'issue que tu veux. C\'est la même chose ici : tu as 1 chance sur 2 de choisir un bol qui a été préparé par ta mère.\n\nAlors, la probabilité de choisir un bol qui te plaît est de 1/2 ou 3/6.\n\nLa bonne réponse est :\n✓ Bonne réponse : B et D (car 1/2 = 3/6)\n\nN\'aie pas peur si tu ne comprends pas tout de suite, Candide. La pratique et la patience sont clés pour apprendre les probabilités ! Qu\'est-ce que tu dis de passer à la suite ?', '2026-05-11 08:13:34'),
(171, 'dev-user-id', 'Probabilités', 'assistant', 'Bonne journée Candide ! Ravie de te retrouver ! Comment vas-tu ? Es-tu en forme ? On peut réviser les probabilités, faire des exercices ou revoir les événements aléatoires, qu\'est-ce que tu choisis ?', '2026-05-11 08:29:15'),
(172, 'dev-user-id', 'Probabilités', 'user', 'Je veux revoir les bases du chapitre depuis le début, étape par étape', '2026-05-11 08:29:34'),
(173, 'dev-user-id', 'Probabilités', 'assistant', 'Candide, excellent choix ! Réviser les bases est toujours utile pour renforcer les connaissances. Allons-y, étape par étape !\n\n**Étape 1 : Qu\'est-ce que la probabilité ?**\n\nLa probabilité est une mesure de la chance ou de la possibilité qu\'un événement se produise. Elle est notée par un nombre entre 0 et 1.\n\n**Étape 2 : Les règles de base**\n\n* Une probabilité de 0 signifie que l\'événement est impossible.\n* Une probabilité de 1 signifie que l\'événement est certain.\n* Une probabilité entre 0 et 1 signifie que l\'événement est possible, mais pas certain.\n\n**Étape 3 : Les types de probabilités**\n\n* La probabilité théorique : c\'est la probabilité calculée à partir des règles de base.\n* La probabilité expérimentale : c\'est la probabilité mesurée à partir d\'expériences répétées.\n\n**Étape 4 : Les principes de calcul**\n\n* La probabilité d\'un événement est calculée en divisant le nombre de résultats favorables par le nombre total de résultats possibles.\n\nMaintenant, prenons un exemple simple pour illustrer ces principes. Imagine que tu tires une pièce de monnaie à 100 CFA. Quelle est la probabilité d\'obtenir face ?\n\nA. 0\nB. 1/2\nC. 1\nD. 2/3\n\nRéfléchis un peu, et je te donnerai la correction !', '2026-05-11 08:29:35'),
(174, 'dev-user-id', 'Probabilités', 'assistant', 'Bonne journée, Candide ! Comment vas-tu ? Es-tu en forme ? On peut réviser les probabilités, faire des exercices ou revoir un point précis, qu\'est-ce que tu choisis ?', '2026-05-11 08:31:04'),
(175, 'dev-user-id', 'Probabilités', 'user', 'Je ne comprends pas, explique autrement avec un exemple simple du quotidien burkinabè', '2026-05-11 08:31:17'),
(176, 'dev-user-id', 'Probabilités', 'assistant', 'Candide, imagine que tu es à une fête de mariage à Ouaga, et que tu veux manger un plat de riz et de sauce. Il y a 6 plats différents, et tu veux choisir un plat qui a un numéro inférieur à 4.\n\nLes plats sont numérotés comme suit :\n\n* Plat 1 : riz et sauce de poulet\n* Plat 2 : riz et sauce de boeuf\n* Plat 3 : riz et sauce de poisson\n* Plat 4 : riz et sauce de légumes\n* Plat 5 : riz et sauce de mouton\n* Plat 6 : riz et sauce de viande de brousse\n\nTu veux choisir un plat qui a un numéro inférieur à 4, c\'est-à-dire les plats 1, 2 ou 3. Il y a 3 plats qui correspondent à ta demande sur un total de 6 plats.\n\nPour calculer la probabilité de choisir l\'un de ces 3 plats, tu peux faire une fraction : 3/6. Et si tu simplifies cette fraction, tu obtiens 1/2.\n\nC\'est comme si tu avais 50% de chances de choisir un plat qui te plaît ! Alors, la probabilité de choisir un plat avec un numéro inférieur à 4 est de 1/2 ou 3/6.\n\nLa bonne réponse est :\n✓ Bonne réponse : B et D (car 1/2 = 3/6)\n\nComprends-tu mieux maintenant, Candide ?', '2026-05-11 08:31:18'),
(177, 'dev-user-id', 'Probabilités', 'assistant', 'Belle matinée Candide ! Content de te revoir ! Comment vas-tu ? En forme ? On peut réviser les probabilités, faire des exercices ou revoir un point précis, comme tu préfères !', '2026-05-11 08:39:58'),
(178, 'dev-user-id', 'Probabilités', 'user', 'Donne-moi un nouvel exercice BEPC varié avec 4 options A B C D', '2026-05-11 08:40:42'),
(179, 'dev-user-id', 'Probabilités', 'assistant', 'Candide, voici un nouvel exercice pour toi :\n\nUn sac contient 12 noix de cola, dont 4 sont brunes et 8 sont blanches. Quelle est la probabilité de tirer une noix de cola brune au hasard ?\n\nA. 1/3\nB. 1/4\nC. 1/6\nD. 1/2\n\nRéfléchis un peu, et je te donnerai la correction ! Imagine que tu es au marché de Ouaga, et que tu achètes un sac de noix de cola. Quelle est la chance de tirer une noix brune ?', '2026-05-11 08:40:44'),
(180, 'dev-user-id', 'Probabilités', 'user', 'Réponse \"A. 1/3\" incorrecte Candide. Explique gentiment l\'erreur, donne la correction pas-à-pas et encourage.', '2026-05-11 08:41:35'),
(181, 'dev-user-id', 'Probabilités', 'assistant', 'Ne t\'inquiète pas, Candide ! Tu as fait un excellent travail en essayant de résoudre le problème. L\'erreur est simplement due à une mauvaise comptage des chances.\n\nTu as 3 taxis qui correspondent à ta demande (1, 2, 3) sur un total de 6 taxis (1, 2, 3, 4, 5, 6). Pour calculer la probabilité, tu divides le nombre de taxis que tu veux (3) par le nombre total de taxis (6).\n\nC\'est comme faire une fraction : 3/6. Maintenant, pour simplifier cette fraction, tu peux diviser le numérateur (3) et le dénominateur (6) par leur plus grand diviseur commun, qui est 3. Cela te donne :\n\n3 ÷ 3 = 1\n6 ÷ 3 = 2\n\nDonc, la fraction simplifiée est 1/2. Pas 1/3, car 1/3 équivaudrait à 2 taxis sur 6, ce qui n\'est pas le cas ici.\n\nAlors, la bonne réponse est :\n✓ Bonne réponse : B et D (car 1/2 = 3/6)\n\nNe te décourage pas, Candide ! Tu es sur la bonne voie. N\'aie pas peur de faire des erreurs, car c\'est ainsi que l\'on apprend. Et rappelle-toi, la pratique fait la perfection ! Qu\'est-ce que tu dis de passer à la suite ?', '2026-05-11 08:41:36'),
(182, 'dev-user-id', 'Probabilités', 'user', '[Exercice soumis] : Factoriser chacune des expressions littérales suivantes :\nA=−(3x−8)×(−x+9)+(3x+3)×(−x+9)', '2026-05-11 08:42:28');
INSERT INTO `conversation_history` (`id`, `user_id`, `chapitre`, `role`, `content`, `created_at`) VALUES
(183, 'dev-user-id', 'Probabilités', 'assistant', 'Je vais t\'aider avec cet exercice. Voici l\'analyse et la solution :\n\n📌 ANALYSE\nExercice de factorisation d\'expressions littérales, notion mathématique de niveau BEPC au Burkina Faso.\n\n📖 EXPLICATION\nPour factoriser l\'expression donnée, nous devons suivre les étapes suivantes :\n1. Distribuer les signes négatifs dans les parenthèses si nécessaire.\n2. Appliquer la propriété distributive pour multiplier les termes dans les parenthèses.\n3. Factoriser les termes communs si possible.\n\nL\'expression est : A = -(3x - 8) × (-x + 9) + (3x + 3) × (-x + 9)\nNous allons commencer par distribuer les signes négatifs et multiplier les termes dans les parenthèses.\n\n✅ SOLUTION\nA = -(3x - 8) × (-x + 9) + (3x + 3) × (-x + 9)\n= (3x - 8) × (x - 9) + (3x + 3) × (-x + 9)\n= (3x^2 - 27x - 8x + 72) + (3x × -x + 3x × 9 + 3 × -x + 3 × 9)\n= (3x^2 - 35x + 72) + (-3x^2 + 27x - 3x + 27)\n= (3x^2 - 3x^2) + (-35x + 27x - 3x) + (72 + 27)\n= 0 + (-11x) + 99\n= -11x + 99\n\nMaintenant, voici deux exercices similaires pour t\'entraîner :\n\n🎯 ENTRAÎNE-TOI !\nExercice 1 : Factoriser l\'expression suivante :\nA = (2x + 5) × (x - 3) - (2x - 1) × (x - 3)\nA. 2x^2 - 6x + 5x - 15 - 2x^2 + 6x - x + 3\nB. 2x^2 + 5x - 6x - 15 - 2x^2 + 6x - x + 3\nC. 2x^2 + 5x - 6x - 15 + 2x^2 - 6x + x - 3\nD. 2x^2 + 5x - 6x - 15 + 2x^2 - 6x + x - 3 + 4x\n✓ Bonne réponse : B\n\nExercice 2 : Factoriser l\'expression suivante :\nB = -(x + 2) × (x - 4) + (x - 1) × (x - 4)\nA. -x^2 + 4x - 2x + 8 + x^2 - 4x - x + 4\nB. -x^2 + 4x - 2x + 8 + x^2 - 4x + x - 4\nC. -x^2 + 4x - 2x + 8 - x^2 + 4x + x - 4\nD. -x^2 + 4x - 2x + 8 - x^2 + 4x + x - 4 + 2x\n✓ Bonne réponse : A\n\nAllez, tu peux le faire ! Je suis là pour t\'aider si tu as besoin de quelque chose. N\'hésite pas à me poser des questions.', '2026-05-11 08:42:28');

-- --------------------------------------------------------

--
-- Structure de la table `exam_results`
--

DROP TABLE IF EXISTS `exam_results`;
CREATE TABLE IF NOT EXISTS `exam_results` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` varchar(36) NOT NULL,
  `chapitre` varchar(100) NOT NULL,
  `score` int NOT NULL,
  `total` int NOT NULL,
  `percentage` int NOT NULL,
  `temps_restant` int DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_chapitre` (`user_id`,`chapitre`)
) ENGINE=MyISAM AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `exam_results`
--

INSERT INTO `exam_results` (`id`, `user_id`, `chapitre`, `score`, `total`, `percentage`, `temps_restant`, `created_at`) VALUES
(1, 'dev-user-id', 'Probabilités', 1, 3, 33, 3582, '2026-05-09 23:09:02'),
(2, 'dev-user-id', 'Mixte', 0, 20, 0, 7189, '2026-05-10 00:13:21'),
(3, 'dev-user-id', 'Mixte', 10, 20, 50, 7164, '2026-05-10 00:14:31'),
(4, 'dev-user-id', 'Mixte', 0, 20, 0, 7177, '2026-05-10 14:57:09'),
(5, 'dev-user-id', 'Mixte', 12, 20, 60, 7171, '2026-05-10 14:57:53'),
(6, 'dev-user-id', 'Mixte', 16, 20, 80, 7181, '2026-05-10 14:59:35'),
(7, 'dev-user-id', 'Algèbre', 2, 20, 10, 7117, '2026-05-10 16:44:05'),
(8, 'dev-user-id', 'Algèbre', 1, 20, 5, 7194, '2026-05-10 17:34:28'),
(9, 'dev-user-id', 'Mixte', 1, 20, 5, 7186, '2026-05-10 23:59:45'),
(10, 'dev-user-id', 'Mixte', 2, 20, 10, 7189, '2026-05-11 08:43:14');

-- --------------------------------------------------------

--
-- Structure de la table `exam_subjects`
--

DROP TABLE IF EXISTS `exam_subjects`;
CREATE TABLE IF NOT EXISTS `exam_subjects` (
  `id` int NOT NULL AUTO_INCREMENT,
  `session` varchar(50) NOT NULL,
  `chapitre` varchar(100) NOT NULL,
  `sujet` longtext NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_session_chapitre` (`session`,`chapitre`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `exam_subjects`
--

INSERT INTO `exam_subjects` (`id`, `session`, `chapitre`, `sujet`, `created_at`) VALUES
(1, '2025', 'Mixte', 'EXAMEN D\'ÉTAT - SESSION 2025\nBEPC - RÉPUBLIQUE DU BURKINA FASO\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nSUJET DE MATHÉMATIQUES\nDurée : 2 heures\nCoefficient : 3\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nINSTRUCTIONS GÉNÉRALES :\n- L\'usage de la calculatrice est autorisé\n- Les figures ne sont pas à l\'échelle\n- Toute solution doit être justifiée\n- Les brouillons ne seront pas corrigés\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nEXERCICE 1 : ALGÈBRE (5 points)\n\n1.1) Résoudre l\'équation : 2x + 5 = 13\n     a) x = 3\n     b) x = 4\n     c) x = 5\n     d) x = 6\n\n1.2) Développer et simplifier : (x + 3)² - (x - 1)²\n     a) 8x + 8\n     b) 8x + 10\n     c) 6x + 8\n     d) 4x + 10\n\n1.3) Factoriser : 4x² - 9\n     a) (2x - 3)²\n     b) (2x + 3)(2x - 3)\n     c) (2x - 3)(2x + 3)\n     d) 2(2x - 4.5)\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nEXERCICE 2 : GÉOMÉTRIE (5 points)\n\nOn considère un triangle ABC rectangle en A.\nOn donne : AB = 3 cm, AC = 4 cm\n\n2.1) Calculer BC en utilisant le théorème de Pythagore\n     a) 5 cm\n     b) 6 cm\n     c) 7 cm\n     d) 12 cm\n\n2.2) L\'aire du triangle ABC est :\n     a) 6 cm²\n     b) 7 cm²\n     c) 12 cm²\n     d) 12.5 cm²\n\n2.3) Un cercle de rayon 2.5 cm et de centre B a pour aire :\n     (on prendra π ≈ 3.14)\n     a) 7.85 cm²\n     b) 15.7 cm²\n     c) 19.625 cm²\n     d) 31.4 cm²\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nEXERCICE 3 : STATISTIQUES ET PROBABILITÉS (5 points)\n\nLors d\'une élection dans un établissement, on recense :\n- 45% d\'élèves du cycle d\'adaptation\n- 35% d\'élèves du 1er cycle\n- 20% d\'élèves du 2ème cycle\n\n3.1) Si l\'établissement compte 1000 élèves, combien d\'élèves sont du 1er cycle ?\n     a) 200 élèves\n     b) 300 élèves\n     c) 350 élèves\n     d) 450 élèves\n\n3.2) La probabilité de choisir un élève du 2ème cycle au hasard est :\n     a) 0.20\n     b) 0.35\n     c) 0.45\n     d) 0.80\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nEXERCICE 4 : PROBLÈME - LES CULTURES AU BURKINA FASO (5 points)\n\nDans un village du Burkina Faso, un agriculteur cultive du mil et du sorgho.\n- Il a récolté 250 kg de mil et 180 kg de sorgho cette année\n- Le prix du mil est 800 CFA/kg\n- Le prix du sorgho est 600 CFA/kg\n\n4.1) Combien de CFA l\'agriculteur a-t-il reçu pour la vente du mil ?\n     a) 150 000 CFA\n     b) 180 000 CFA\n     c) 200 000 CFA\n     d) 250 000 CFA\n\n4.2) Quel est le revenu total (mil + sorgho) ?\n     a) 108 000 CFA\n     b) 200 000 CFA\n     c) 308 000 CFA\n     d) 400 000 CFA\n\n4.3) Si l\'agriculteur veut acheter une charrette à 150 000 CFA, combien lui restera-t-il après cet achat ?\n     a) 58 000 CFA\n     b) 108 000 CFA\n     c) 158 000 CFA\n     d) 308 000 CFA\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nFIN DU SUJET\n', '2026-05-09 23:18:56');

-- --------------------------------------------------------

--
-- Structure de la table `exercices_log`
--

DROP TABLE IF EXISTS `exercices_log`;
CREATE TABLE IF NOT EXISTS `exercices_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` varchar(36) NOT NULL,
  `chapitre` varchar(100) NOT NULL,
  `correct` tinyint(1) NOT NULL,
  `xp_gagne` int DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `exercices_log`
--

INSERT INTO `exercices_log` (`id`, `user_id`, `chapitre`, `correct`, `xp_gagne`, `created_at`) VALUES
(1, 'dev-user-id', 'Probabilités', 0, 5, '2026-05-09 23:34:37'),
(2, 'dev-user-id', 'Probabilités', 0, 5, '2026-05-10 00:05:51'),
(3, 'dev-user-id', 'Probabilités', 0, 5, '2026-05-10 00:12:34'),
(4, 'dev-user-id', 'Probabilités', 0, 5, '2026-05-10 14:54:32'),
(5, 'dev-user-id', 'Probabilités', 0, 5, '2026-05-10 16:18:54'),
(6, 'dev-user-id', 'Probabilités', 0, 5, '2026-05-10 18:52:05'),
(7, 'dev-user-id', 'Géométrie', 0, 5, '2026-05-10 23:29:40'),
(8, 'dev-user-id', 'Probabilités', 0, 5, '2026-05-11 08:41:34');

-- --------------------------------------------------------

--
-- Structure de la table `progression`
--

DROP TABLE IF EXISTS `progression`;
CREATE TABLE IF NOT EXISTS `progression` (
  `id` varchar(36) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `chapitre` varchar(100) NOT NULL,
  `score` int DEFAULT '0',
  `sessions` int DEFAULT '0',
  `exercices` int DEFAULT '0',
  `reussites` int DEFAULT '0',
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_chapitre` (`user_id`,`chapitre`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
CREATE TABLE IF NOT EXISTS `sessions` (
  `id` varchar(36) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `chapitre` varchar(100) NOT NULL,
  `xp_gagne` int DEFAULT '0',
  `duree_sec` int DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` varchar(36) NOT NULL,
  `nom` varchar(100) NOT NULL,
  `prenom` varchar(100) NOT NULL,
  `email` varchar(191) NOT NULL,
  `password` varchar(255) NOT NULL,
  `xp` int DEFAULT '0',
  `niveau` int DEFAULT '1',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `profil_pedagogique` text,
  `profil_updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
