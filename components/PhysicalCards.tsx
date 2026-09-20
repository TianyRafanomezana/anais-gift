import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Pressable, ScrollView, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  interpolate,
  Extrapolation,
  Easing,
  withDelay,
  cancelAnimation
} from 'react-native-reanimated';

interface CardData {
  id: string;
  rectoTitle: string;
  rectoSubtitle: string;
  versoText: string;
}

const CARDS_DATA: CardData[] = [
  {
    id: '1',
    rectoTitle: 'Pensée n°1',
    rectoSubtitle: 'Un coeur nouveau',
    versoText: 'Verset à lire avant de lire la suite : \n Ézéchiel 36:26-27. \n\n Ton coeur a été renouvelé en Christ. \n\n Tu as un nouveau coeur en Dieu, il reconstruit ton coeur, petit à petit, fil par fil, pour former le nouveau. \n\n Je t\'offre ce coeur en cet honneur, qu\'a chaque fois que tu le vois, ca soit une occasion de se rappeler l\'oeuvre de Dieu en toi \n\n Que ce coeur soit, admiré de tous. \n\n Tu brille ma soeur, que rien ne t\'empêche de briller. \n\n Et sache qu\'aucune pensée, aucune action, aucune décision ne t\'éloigneras de son amour. \n\n Be blessed ma soeur, tu es sa fille et tu brille de lui.',
  },
  {
    id: '2',
    rectoTitle: 'Pensée n°2',
    rectoSubtitle: 'Un coeur libre',
    versoText: 'Verset à lire avant de lire la suite : \n 2 Corinthiens 3:16-17. \n\n Ton être tout entier est transformé à son image. \n\n Tu es libre et ton coeur est transformé à son image, tissé selon lui. \n\n  Que rien ne t\'arrête dans ta liberté. Si tu tombes, il te relèvera. \n\n Ce que Dieu fait avec toi, rien ne l\'empechera. \n\n Tu es libre. ',
  },
  {
    id: '3',
    rectoTitle: 'Pensée n°2',
    rectoSubtitle: 'Un coeur et une \n  lettre d\'amour',
    versoText: 'Verset à lire avant de lire la suite : \n2 Corinthiens 2:3. \n\nTon coeur est une lettre d\'amour pour ce monde autour de toi. Les passions et les dons qu\'il a mis dans ton coeur sont une lettre pour eux. \n\n Cette lettre sera lu et contemplé de tous, et c\'est Christ qu\'il verront quand ils te verront. \n\n Ce sera la lumière de Jésus qui brille en toi. \n\n Mais ce temps nécessitera d\'être préparée, tissé et endurcis à son image. \n\n Bon temps de préparation ma soeur. ',
  }
];

interface PhysicalCardsProps {
  isOpen: boolean;
}

const CardItem = ({
  data,
  index,
  activeIndex,
  onSelect,
  isFlipped,
  onFlip,
  isOpen
}: {
  data: CardData;
  index: number;
  activeIndex: number | null;
  onSelect: () => void;
  isFlipped: boolean;
  onFlip: () => void;
  isOpen: boolean;
}) => {
  const isSelected = activeIndex === index;
  const isAnotherSelected = activeIndex !== null && activeIndex !== index;

  const positionProgress = useSharedValue(0); // 0 = stack, 1 = centered
  const flipProgress = useSharedValue(0); // 0 = recto, 1 = verso

  // Animation en 2 temps
  const emergeProgress = useSharedValue(0); // 0 = inside box, 1 = emerged slightly
  const flyProgress = useSharedValue(0); // 0 = emerged, 1 = fully stacked

  // Animation d'ouverture/fermeture (sortie de la boîte)
  useEffect(() => {
    // Courbe de type "Apple" très douce (ease-out-quint/expo)
    const smoothEasing = Easing.bezier(0.16, 1, 0.3, 1);

    if (isOpen) {
      // Sortie avec délai selon l'index. Ultra lent et cotonneux
      emergeProgress.value = withDelay(index * 400, withTiming(1, { duration: 1500, easing: smoothEasing }));
      flyProgress.value = withDelay(index * 400 + 700, withTiming(1, { duration: 1800, easing: smoothEasing }));
    } else {
      // Retour fluide
      flyProgress.value = withTiming(0, { duration: 800, easing: Easing.inOut(Easing.cubic) });
      emergeProgress.value = withDelay(400, withTiming(0, { duration: 800, easing: Easing.inOut(Easing.cubic) }));
    }
  }, [isOpen]);

  useEffect(() => {
    // Zoom/Focus d'une carte très fluide
    const smoothEasing = Easing.bezier(0.16, 1, 0.3, 1);
    positionProgress.value = withTiming(isSelected ? 1 : 0, { duration: 1200, easing: smoothEasing });
  }, [isSelected]);

  useEffect(() => {
    // Retournement ultra doux
    const smoothEasing = Easing.bezier(0.16, 1, 0.3, 1);
    flipProgress.value = withTiming(isFlipped && isSelected ? 1 : 0, { duration: 1200, easing: smoothEasing });
  }, [isFlipped, isSelected]);

  const animatedStyle = useAnimatedStyle(() => {
    // ---- 1. Calcul de la position dans la pile (ouverte) ----
    // Les cartes feront ~64px de haut (160 * 0.4). 
    // On veut qu'elles soient réparties sur l'écran sans déborder en haut.
    // La carte du bas (index 2) se met à Y=-40 (juste au dessus de la boite).
    // Espacement de 70px (légèrement plus grand que la hauteur de 64px).
    const stackY = -40 - ((2 - index) * 70);
    // Centre de l'écran (environ la position de la carte du milieu)
    const focusY = -110;

    // Interpolation Focus (0 = empilé, 1 = sélectionné et mis en avant)
    const translateY = interpolate(positionProgress.value, [0, 1], [stackY, focusY]);
    const focusScale = interpolate(positionProgress.value, [0, 1], [0.4, 0.46]);

    // ---- 2. Phase 1 : Émergence (Sortie de la boîte) ----
    // La boîte est à Y=0. On sort vers Y=-50 (vers le haut).
    const emergeY = interpolate(emergeProgress.value, [0, 1], [10, -50]);
    // On simule une carte posée à plat qui se soulève très légèrement
    const emergeRotateX = interpolate(emergeProgress.value, [0, 1], [90, 70]);
    const emergeScale = 0.25;

    // ---- 3. Phase 2 : Envol (Vers l'écran, se redresse) ----
    const finalY = interpolate(flyProgress.value, [0, 1], [emergeY, translateY]);
    const finalScale = interpolate(flyProgress.value, [0, 1], [emergeScale, focusScale]);
    const finalRotateX = interpolate(flyProgress.value, [0, 1], [emergeRotateX, 0]);

    // Opacité pour cacher la carte quand elle est totalement dans la boîte (scale très petit ou rotate 90)
    const baseOpacity = interpolate(emergeProgress.value, [0, 0.2, 1], [0, 1, 1]);
    const opacity = isAnotherSelected ? withTiming(0, { duration: 300 }) : baseOpacity;

    // 3D Flip
    const rotateY = interpolate(flipProgress.value, [0, 1], [0, 180]);

    return {
      opacity,
      transform: [
        { translateY: finalY },
        { scale: finalScale },
        { perspective: 800 },
        { rotateX: `${finalRotateX}deg` },
        { rotateY: `${rotateY}deg` }
      ],
      zIndex: isSelected ? 100 : 10 + index
    };
  });

  const frontStyle = useAnimatedStyle(() => {
    const opacity = interpolate(flipProgress.value, [0, 0.5, 1], [1, 0, 0], Extrapolation.CLAMP);
    return { opacity };
  });

  const backStyle = useAnimatedStyle(() => {
    const opacity = interpolate(flipProgress.value, [0, 0.5, 1], [0, 0, 1], Extrapolation.CLAMP);
    return {
      opacity,
      transform: [{ rotateY: '180deg' }] // Keep text readable
    };
  });

  return (
    <Animated.View style={[styles.cardContainer, animatedStyle]} pointerEvents={isOpen ? 'box-none' : 'none'}>
      <Pressable
        style={StyleSheet.absoluteFill}
        onPress={(e) => {
          if (!isOpen) return; // Inactif si la boîte est fermée
          if (e && e.stopPropagation) e.stopPropagation();

          if (!isSelected) {
            onSelect();
          } else {
            onFlip();
          }
        }}
        pointerEvents={isAnotherSelected ? 'none' : 'auto'}
      >
        {/* RECTO (Front) */}
        <Animated.View style={[styles.cardFace, styles.cardFront, frontStyle]}>
          <View style={styles.laceBorder}>
            <View style={styles.cardFrontInner}>
              <Text style={styles.rectoSubtitle}>{data.rectoSubtitle}</Text>
              <Text style={styles.rectoTitle}>{data.rectoTitle}</Text>

              {/* Sceau cœur coquette */}
              <View style={styles.heartSeal}>
                <Text style={styles.heartIcon}>❤</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* VERSO (Back) */}
        <Animated.View style={[styles.cardFace, styles.cardBack, backStyle]}>
          <View style={styles.laceBorder}>
            <ScrollView
              style={{ flex: 1, width: '100%' }}
              contentContainerStyle={styles.cardBackInner}
              showsVerticalScrollIndicator={true}
              indicatorStyle="black"
            >
              <Text style={styles.versoText}>{data.versoText}</Text>
            </ScrollView>
          </View>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
};

export default function PhysicalCards({ isOpen }: PhysicalCardsProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);

  const blackProgress = useSharedValue(0);
  const [isEmerged, setIsEmerged] = useState(false);

  useEffect(() => {
    const smoothEasing = Easing.bezier(0.16, 1, 0.3, 1);
    if (isOpen) {
      // Assombrissement progressif et long
      blackProgress.value = withDelay(800, withTiming(1, { duration: 2000, easing: smoothEasing }));
      // On passe la couche au premier plan un peu plus tard vu que c'est plus lent
      setTimeout(() => setIsEmerged(true), 600);
    } else {
      blackProgress.value = withTiming(0, { duration: 800, easing: Easing.out(Easing.cubic) });
      setIsEmerged(false);
    }
  }, [isOpen]);

  const blackFilterStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(blackProgress.value, [0, 1], [0, 0.75])
    };
  });

  // Reset state quand on referme la boîte
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setActiveIndex(null);
        setIsFlipped(false);
      }, 400); // Après l'animation de retour
    }
  }, [isOpen]);

  return (
    <Animated.View style={[styles.container, { zIndex: isEmerged ? 10 : 1 }]} pointerEvents="box-none">
      {Platform.OS === 'web' && React.createElement('style', null, `
        ::-webkit-scrollbar {
          width: 5px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(74, 21, 37, 0.3);
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(74, 21, 37, 0.6);
        }
      `)}
      {/* Filtre noir en fond qui s'affiche quand les cartes volent vers l'écran */}
      <Animated.View style={[styles.blackOverlay, blackFilterStyle]} pointerEvents="none" />

      {/* Zone de clic géante pour désélectionner quand une carte est en focus */}
      {activeIndex !== null && (
        <Pressable
          style={styles.backdropPressable}
          onPress={() => {
            setActiveIndex(null);
            setIsFlipped(false);
          }}
        />
      )}

      {CARDS_DATA.map((card, index) => (
        <CardItem
          key={card.id}
          data={card}
          index={index}
          isOpen={isOpen}
          activeIndex={activeIndex}
          isFlipped={isFlipped}
          onSelect={() => {
            setActiveIndex(index);
            setIsFlipped(false);
          }}
          onFlip={() => setIsFlipped(!isFlipped)}
        />
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    // zIndex géré dynamiquement par containerStyle
  },
  cardContainer: {
    position: 'absolute',
    width: 320,
    height: 160,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
  },
  cardFace: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#D4AF37', // Doré
    borderRadius: 8,
    padding: 6,
    borderWidth: 1,
    borderColor: '#EAE0D5',
  },
  laceBorder: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(74, 21, 37, 0.4)', // Bordeaux subtil
    borderStyle: 'dashed',
    borderRadius: 4,
    padding: 10,
  },
  cardFront: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardFrontInner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  rectoTitle: {
    fontFamily: 'PinyonScript_400Regular',
    fontSize: 28,
    color: '#4A1525', // Bordeaux très foncé
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  rectoSubtitle: {
    fontSize: 10,
    color: '#4A1525', // Bordeaux
    textTransform: 'uppercase',
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: 5,
  },
  heartSeal: {
    position: 'absolute',
    bottom: -15,
    alignSelf: 'center',
    width: 24,
    height: 24,
    backgroundColor: '#FDFBF7', // Écru
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4A1525',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#4A1525',
  },
  heartIcon: {
    color: '#4A1525', // Bordeaux
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 14,
    marginTop: 2,
  },
  cardBack: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D4AF37', // Doré
  },
  cardBackInner: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  versoText: {
    fontSize: 15,
    color: '#4A1525',
    lineHeight: 22,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  backdropPressable: {
    position: 'absolute',
    width: 4000,
    height: 4000,
    top: -2000,
    left: -2000,
    zIndex: 5, // En dessous des cartes (zIndex 10+), mais attrape les clics autour
  },
  blackOverlay: {
    position: 'absolute',
    width: 4000,
    height: 4000,
    top: -2000,
    left: -2000,
    backgroundColor: '#000',
    zIndex: 0,
  },
});
