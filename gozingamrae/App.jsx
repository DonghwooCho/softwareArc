import {Suspense} from 'react';
import {RecoilRoot} from 'recoil';
import {SafeAreaView, StyleSheet} from 'react-native';
import AppScreens from './app/navigations/navigation';
import {color} from './app/utils';

export default function App() {
  return (
    <RecoilRoot>
      <Suspense>
        <SafeAreaView style={styles.container}>
          <AppScreens />
        </SafeAreaView>
      </Suspense>
    </RecoilRoot>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.white,
  },
});
