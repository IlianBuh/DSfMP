# Android build troubleshooting (Expo / React Native)

## Error: `Dependency requires at least JVM runtime version 11. This build uses a Java 8 JVM.`
Причина: `gradlew` запускается под Java 8.

Решение: переключиться на JDK 11+ (рекомендуется JDK 17, т.к. он совместим с современным Android Gradle Plugin).

### Быстрый фикс (только для текущей PowerShell-сессии)
1) Проверьте текущую Java:
   - `java -version`
2) Укажите JAVA_HOME на JDK 17 (вариант — встроенный JDK от Android Studio):
   - `$env:JAVA_HOME="C:\Program Files\Android\Android Studio\jbr"`
   - `$env:Path="$env:JAVA_HOME\bin;$env:Path"`
3) Убедитесь, что версия стала 11+:
   - `java -version`
4) Пересоберите:
   - `npx expo run:android`

### Долгосрочный фикс
- Установить JDK 17 (например, Temurin) и выставить `JAVA_HOME` в переменных среды Windows.
- В Android Studio: `Settings → Build, Execution, Deployment → Build Tools → Gradle → Gradle JDK` = JDK 17.

## Legacy error: `expo-module-gradle-plugin` not found
Если падает сборка с ошибкой про `expo-module-gradle-plugin`, обычно помогает:
- `npx expo prebuild --platform android`
- затем `npx expo run:android`
