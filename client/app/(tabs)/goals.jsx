import AsyncStorage from '@react-native-async-storage/async-storage'
import { ScrollView, View, Text, StyleSheet, Pressable } from 'react-native'
import { useState, useEffect } from 'react'
import { WebView } from 'react-native-webview'
import colours from '../../constants/colours'
import Card from '../../components/Card'
import AddButton from '../../components/AddButton'
import AddModal from '../../components/AddModal'
import Field from '../../components/Field'
import { getGoals, createGoal, updateGoal, deleteGoal } from '../../api/goals'
import { getFeasibility, getPriority, getOptimisation } from '../../api/goalInsights'

const GOALS_CHART_URL = 'https://vivid-abaft.metabaseapp.com/public/question/b2d671f5-1801-4fa0-b123-26a28f0a3b6d#titled=false'

export default function goals() {
  const [householdId, setHouseholdId] = useState(null)
  const [goals, setGoals] = useState([])
  const [insights, setInsights] = useState({ feasibility: null, priority: null, optimisation: null })
  const [insightsLoading, setInsightsLoading] = useState(false)

  const [activeModal, setActiveModal] = useState(null)
  const [selectedGoal, setSelectedGoal] = useState(null)

  const [goalName, setGoalName] = useState('')
  const [goalAmount, setGoalAmount] = useState('')
  const [targetDate, setTargetDate] = useState('')

  const [commitAmount, setCommitAmount] = useState('')

  useEffect(() => {
    loadHouseholdId()
  }, [])

  useEffect(() => {
    if (householdId === null) return
    loadGoals()
    loadInsights()
  }, [householdId])

  async function loadHouseholdId() {
    const stored = await AsyncStorage.getItem('household')
    if (!stored) {
      setHouseholdId(1)
      return
    }
    const { household_id } = JSON.parse(stored)
    setHouseholdId(Number(household_id) || 1)
  }

  async function loadGoals() {
    try {
      const data = await getGoals(householdId)
      const goalList = Array.isArray(data) ? data : data.goals
      setGoals(Array.isArray(goalList) ? goalList : [])
    } catch (error) {
      setGoals([])
    }
  }

  async function loadInsights() {
    setInsightsLoading(true)
    try {
      const [feasibility, priority, optimisation] = await Promise.all([
        getFeasibility(householdId),
        getPriority(householdId),
        getOptimisation(householdId),
      ])
      setInsights({
        feasibility: typeof feasibility === 'string' ? feasibility : null,
        priority: typeof priority === 'string' ? priority : null,
        optimisation: typeof optimisation === 'string' ? optimisation : null,
      })
    } catch (error) {
      setInsights({ feasibility: null, priority: null, optimisation: null })
    } finally {
      setInsightsLoading(false)
    }
  }

  async function handleAddGoal() {
    if (!goalName || !goalAmount) return
    await createGoal({
      household_id: householdId,
      goal_name: goalName,
      goal_amount: Number(goalAmount) || 0,
      current_value: 0,
      target_date: targetDate || null,
    })
    setGoalName('')
    setGoalAmount('')
    setTargetDate('')
    setActiveModal(null)
    loadGoals()
    loadInsights()
  }

  async function handleCommit() {
    if (!commitAmount || !selectedGoal) return
    const current = Number(selectedGoal.current_value) || 0
    await updateGoal({
      goal_id: selectedGoal.goal_id,
      goal_name: selectedGoal.goal_name,
      goal_amount: Number(selectedGoal.goal_amount) || 0,
      current_value: current + (Number(commitAmount) || 0),
      target_date: selectedGoal.target_date ?? null,
    })
    setCommitAmount('')
    setSelectedGoal(null)
    setActiveModal(null)
    loadGoals()
  }

  async function handleDelete(goal_id) {
    await deleteGoal(goal_id)
    loadGoals()
    loadInsights()
  }

  function openCommit(goal) {
    setSelectedGoal(goal)
    setActiveModal('commit')
  }

  function renderInsights() {
    if (insightsLoading) {
      return <Text style={styles.line}>Generating your AI insights…</Text>
    }
    const { feasibility, priority, optimisation } = insights
    if (!feasibility && !priority && !optimisation) {
      return <Text style={styles.line}>Add goals to get AI insights on feasibility, priority and savings.</Text>
    }
    return (
      <>
        {feasibility ? (
          <>
            <Text style={styles.insightLabel}>Feasibility</Text>
            <Text style={styles.line}>{feasibility}</Text>
          </>
        ) : null}
        {priority ? (
          <>
            <Text style={styles.insightLabel}>Priority</Text>
            <Text style={styles.line}>{priority}</Text>
          </>
        ) : null}
        {optimisation ? (
          <>
            <Text style={styles.insightLabel}>Saving Tips</Text>
            <Text style={styles.line}>{optimisation}</Text>
          </>
        ) : null}
      </>
    )
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.heading}>Goals</Text>
            <Text style={styles.sub}>Save together and track your progress</Text>
          </View>
        </View>

        <Card title="AI Insights">
          {renderInsights()}
        </Card>

        <Card title="Goals Progress">
          <View style={styles.chartBox}>
            <WebView source={{ uri: GOALS_CHART_URL }} style={{ flex: 1 }} />
          </View>
        </Card>

        {goals.length === 0 ? (
          <Card title="Your Goals">
            <Text style={styles.empty}>No goals yet — add one to get started.</Text>
          </Card>
        ) : (
          goals.map((goal) => {
            const amount = Number(goal.goal_amount) || 0
            const current = Number(goal.current_value) || 0
            const pct = amount > 0 ? Math.min(100, Math.round((current / amount) * 100)) : 0
            return (
              <Card key={goal.goal_id} title={goal.goal_name}>
                <View style={styles.row}>
                  <Text style={styles.label}>Progress</Text>
                  <Text style={styles.value}>
                    £{current.toLocaleString()} / £{amount.toLocaleString()}
                  </Text>
                </View>
                <View style={styles.track}>
                  <View style={[styles.fill, { width: `${pct}%` }]} />
                </View>
                {goal.target_date ? (
                  <Text style={styles.meta}>Target date: {goal.target_date}</Text>
                ) : null}
                <View style={styles.actions}>
                  <Pressable onPress={() => openCommit(goal)}>
                    <Text style={styles.actionAdd}>Add money</Text>
                  </Pressable>
                  <Pressable onPress={() => handleDelete(goal.goal_id)}>
                    <Text style={styles.actionDelete}>Delete</Text>
                  </Pressable>
                </View>
              </Card>
            )
          })
        )}
      </ScrollView>

      <AddButton onPress={() => setActiveModal('add')} />

      <AddModal
        title={activeModal === 'commit' ? 'Add Money To Goal' : 'Add A Goal'}
        visible={activeModal !== null}
        setVisible={() => setActiveModal(null)}
      >
        {activeModal === 'add' && (
          <View style={styles.form}>
            <Field label="Goal Name" placeholder="e.g. Holiday Fund" value={goalName} onChangeText={setGoalName} />
            <Field label="Goal Amount" placeholder="e.g. 2000" keyboardType="numeric" value={goalAmount} onChangeText={setGoalAmount} />
            <Field label="Target Date" placeholder="YYYY-MM-DD" value={targetDate} onChangeText={setTargetDate} />
            <Pressable style={styles.submit} onPress={handleAddGoal}>
              <Text style={styles.submitText}>Add Goal</Text>
            </Pressable>
          </View>
        )}

        {activeModal === 'commit' && (
          <View style={styles.form}>
            <Field label="Amount to add" placeholder="e.g. 100" keyboardType="numeric" value={commitAmount} onChangeText={setCommitAmount} />
            <Pressable style={styles.submit} onPress={handleCommit}>
              <Text style={styles.submitText}>Add Money</Text>
            </Pressable>
          </View>
        )}
      </AddModal>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colours.background },
  body: { padding: 16, paddingTop: 30, paddingBottom: 24 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerText: { flex: 1, paddingRight: 12 },
  heading: { fontSize: 24, fontWeight: '800', color: colours.pageHeader },
  sub: { fontSize: 13, color: '#7a8794', marginBottom: 16, marginTop: 4 },
  line: { fontSize: 13, color: '#3f4856', paddingVertical: 6, lineHeight: 18 },
  insightLabel: { fontSize: 13, fontWeight: '700', color: colours.pageHeader, marginTop: 10, marginBottom: 2 },
  empty: { fontSize: 13, color: '#9aa3b0', paddingVertical: 6 },
  chartBox: { height: 280, borderRadius: 12, overflow: 'hidden' },

  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  label: { color: '#55626d' },
  value: { fontWeight: '700', color: '#2f3a48' },
  meta: { fontSize: 12, color: '#7a8794', marginTop: 8 },
  track: { height: 12, borderRadius: 8, backgroundColor: '#e3e9f0', overflow: 'hidden', marginTop: 8 },
  fill: { height: '100%', backgroundColor: colours.cardTitle, borderRadius: 8 },

  actions: { flexDirection: 'row', gap: 18, marginTop: 12 },
  actionAdd: { fontSize: 13, fontWeight: '700', color: colours.cardTitle },
  actionDelete: { fontSize: 13, fontWeight: '700', color: '#d1495b' },

  form: { width: 260 },
  submit: { backgroundColor: colours.cardTitle, borderRadius: 10, height: 46, alignItems: 'center', justifyContent: 'center', marginTop: 4 },
  submitText: { color: '#fff', fontWeight: '700', fontSize: 15 },
})
