// components/ui/GradientIcon.tsx
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { IconSymbol } from './IconSymbol';

export function GradientIcon({
    name,
    size = 28,
    focused,
    style,
}: {
    name: string;
    size?: number;
    focused?: boolean;
    style?: StyleProp<ViewStyle>;
}) {
    if (!focused) {
        return <IconSymbol name={name as any} size={size} color="gray" style={style as any} />;
    }

    return (
        <MaskedView
            style={style}
            maskElement={<IconSymbol name={name as any} size={size} color="black" />}
        >
            <LinearGradient
                colors={['#6B5CFF', '#5E80FF',]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ width: size, height: size }}
            />
        </MaskedView>
    );
}
