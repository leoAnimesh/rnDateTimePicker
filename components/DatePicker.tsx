import { FlatList, Modal, StatusBar, StyleProp, StyleSheet, Text, TextStyle, TouchableOpacity, TouchableOpacityProps, View, ViewStyle } from 'react-native'
import React, { ReactNode } from 'react'

interface DatePickerProps {
    value: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;
    show: boolean;
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

interface ActionBtnProps extends TouchableOpacityProps {
    content: string;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
}

interface DaysView {
    updateDate: (dateLocalString: string) => void;
}

type modeType = 'days' | 'months' | 'years';

const COLORS = {
    white: '#FFFFFF',
    black: '#000000',
    primary: '#1B46F5',
    secondary: '#F5F5F5',
    backdrop: 'rgba(0,0,0,0.5)'
}

const getCurrentData = (dateString: string) => {
    const [month, day, year] = dateString.split('/');
    return {
        currentDay: parseInt(day),
        currentMonth: parseInt(month),
        currentYear: parseInt(year)
    }
}

const ActionBtn: React.FC<ActionBtnProps> = ({ content, style, textStyle, ...rest }) => {
    return (
        <TouchableOpacity {...rest} style={[styles.actionBtn, style]}  >
            <Text style={[{ fontWeight: '500', color: COLORS.black, textAlign: 'center' }, textStyle]} >{content}</Text>
        </TouchableOpacity>
    )
}

const DynamicBtn = ({ updateDate, content, date, mode }: any) => {
    const { currentDay, currentMonth, currentYear } = getCurrentData(date);

    const getValueByMode: { [key: string]: number } = {
        days: currentDay,
        months: currentMonth,
        years: currentYear
    }

    const DynamicDayCellColor = (value: string) => {
        if (value === '') return 'transparent';
        // if (value !== '' && parseInt(value) !== getValueByMode[mode]) return COLORS.white;
        if (parseInt(value) === getValueByMode[mode]) return COLORS.primary;
    }

    const DynamicDayCellTextColor = (day: string) => {
        if (parseInt(day) === currentDay) return COLORS.white;
    }

    const updateDateDynamically = () => {
        if (mode === 'days') {
            updateDate(`${currentMonth}/${content}/${currentYear} `);
        }

        if (mode === 'years') {
            updateDate(`${currentMonth}/${currentDay}/${content} `);
        }
    }

    return (
        <ActionBtn
            onPress={updateDateDynamically}
            content={`${content}`}
            style={{ flex: 1, backgroundColor: DynamicDayCellColor(content) }}
            textStyle={{ color: DynamicDayCellTextColor(content) }} />
    )
}

const DaysView = ({ updateDate, date, mode }: any) => {
    const { currentMonth, currentYear } = getCurrentData(date);
    const WEEKS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    const NUMBER_OF_DAYS_IN_MONTH = new Date(currentYear, currentMonth, 0).getDate();
    const MONTH_START_DAY = new Date(currentYear, currentMonth - 1, 1).getDay();
    const DAYS_IN_MONTH = Array.from(Array(35).keys()).map((item, index) => {
        if (index < MONTH_START_DAY) return '';
        if (index > NUMBER_OF_DAYS_IN_MONTH + MONTH_START_DAY - 1) return '';
        return `${item - MONTH_START_DAY + 1} `;
    })

    return (
        <View>
            {/* weeks row */}
            <FlatList
                data={WEEKS}
                showsHorizontalScrollIndicator={false}
                numColumns={7}
                contentContainerStyle={{ marginBottom: 5 }}
                renderItem={({ item }) => {
                    return <Text style={{ flex: 1, textAlign: 'center', justifyContent: 'center', alignItems: 'center', color: 'gray' }}>{item}</Text>
                }} />
            {/* days row */}
            <FlatList
                data={DAYS_IN_MONTH}
                showsHorizontalScrollIndicator={false}
                numColumns={7}
                columnWrapperStyle={{ gap: 10, marginBottom: 10 }}
                contentContainerStyle={{ marginVertical: 10 }}
                renderItem={({ item }) => {
                    return <DynamicBtn updateDate={updateDate} content={item} date={date} mode={mode} />
                }}
            />
        </View>
    )
}

const MonthsView = ({ updateDate, date }: any) => {
    const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Nov', 'Dec', ''];
    const { currentMonth, currentYear } = getCurrentData(date);

    return (
        <View>
            {/* days row */}
            <FlatList
                data={MONTHS}
                showsHorizontalScrollIndicator={false}
                numColumns={3}
                columnWrapperStyle={{ gap: 10, marginBottom: 10 }}
                contentContainerStyle={{ marginVertical: 10 }}
                renderItem={({ item }) => {
                    return <DynamicBtn updateDate={updateDate} content={item} date={date} />
                }}
            />
        </View>
    )
}

const YearsView = ({ updateDate, date }: any) => {
    const { currentMonth, currentYear } = getCurrentData(date);

    const YEARS_FROM_NOW = Array.from(Array(25).keys()).reverse().map((item, index) => {
        return `${currentYear - (24 - index)} `;
    });


    return (
        <View>
            {/* days row */}
            <FlatList
                data={YEARS_FROM_NOW}
                showsHorizontalScrollIndicator={false}
                numColumns={5}
                columnWrapperStyle={{ gap: 10, marginBottom: 10 }}
                contentContainerStyle={{ marginVertical: 10 }}
                renderItem={({ item }) => {
                    return <DynamicBtn updateDate={updateDate} content={item} date={date} />
                }}
            />
        </View>
    )
}

const RenderViews: { days: (props: any) => ReactNode, months: (props: any) => ReactNode, years: (props: any) => ReactNode } = {
    days: (props: any) => <DaysView {...props} />,
    months: (props: any) => <MonthsView {...props} />,
    years: (props: any) => < YearsView {...props} />
}

const DatePicker: React.FC<DatePickerProps> = ({ value, setValue, show, setShow }) => {
    const [mode, setMode] = React.useState<modeType>('days');

    const { currentMonth, currentYear } = getCurrentData(value);
    const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Nov', 'Dec'];


    const updateDate = (dateLocalString: string) => {
        const [month, day, year] = dateLocalString.split('/');
        setValue(`${month} /${day}/${year} `);
    }


    return (
        <View >
            <StatusBar backgroundColor={COLORS.backdrop} barStyle={'light-content'} />
            <Modal
                hardwareAccelerated={true}
                animationType="fade"
                transparent={true}
                visible={show}
                onRequestClose={() => setShow(!show)}
            >
                <TouchableOpacity activeOpacity={1} onPress={() => setShow(!show)} style={styles.mainContainer}>
                    <TouchableOpacity activeOpacity={1} style={styles.modalContainer} >
                        {/* picker header bar  */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                            <ActionBtn content='<' style={{ borderRadius: 50, height: 30, width: 30 }} />
                            <View style={{ flexDirection: 'row', flex: 0.7, gap: 15 }}>
                                <ActionBtn onPress={() => setMode('months')} content={MONTHS[currentMonth - 1]} style={{ flex: 1 }} />
                                <ActionBtn onPress={() => setMode('years')} content={`${currentYear} `} style={{ flex: 1 }} />
                            </View>
                            <ActionBtn content='>' style={{ borderRadius: 50, height: 30, width: 30 }} />
                        </View>
                        {/* picker body */}
                        {RenderViews[mode]({ updateDate, date: value, mode })}
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>
        </View >
    )
}

export default DatePicker

const styles = StyleSheet.create({
    mainContainer: {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    modalContainer: {
        width: '90%',
        backgroundColor: COLORS.secondary,
        padding: 15,
        paddingBottom: 5,
        borderRadius: 10,
    },
    actionBtn: {
        height: 35,
        width: 35,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.white
    }
})