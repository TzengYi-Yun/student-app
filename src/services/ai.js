export function generateStudyPlan(tasks) {
    const plans = [];
  
    const sorted = [...tasks].sort(
      (a, b) =>
        new Date(a.deadline) - new Date(b.deadline)
    );
  
    sorted.forEach((task) => {
      const deadline = new Date(task.deadline);
  
      for (let i = 1; i <= 2; i++) {
        const d = new Date(deadline);
        d.setDate(deadline.getDate() - i);
  
        plans.push({
          id: `${task.id}-${i}`,
          title: `📚 Study: ${task.title}`,
          date: d.toISOString(),
          type: "study",
        });
      }
    });
  
    return plans;
  }