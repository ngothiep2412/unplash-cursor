import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TASKS_FILE = path.join(process.cwd(), 'tasks', 'tasks.json');

async function readTasks() {
  const data = await fs.readFile(TASKS_FILE, 'utf8');
  return JSON.parse(data).tasks;
}

async function writeTasks(tasks) {
  const data = { tasks };
  await fs.writeFile(TASKS_FILE, JSON.stringify(data, null, 2));
}

export async function runCLI(argv) {
  const [,, command, ...args] = argv;

  try {
    switch (command) {
      case 'list': {
        const tasks = await readTasks();
        console.log('\nTask List:\n');
        for (const task of tasks) {
          const status = task.status === 'done' ? '✅' : '⏳';
          const deps = task.dependencies.length ? `[deps: ${task.dependencies.join(', ')}]` : '';
          console.log(`${status} ${task.id}. ${task.title} (${task.priority}) ${deps}`);
        }
        break;
      }

      case 'show': {
        const id = parseInt(args[0]);
        if (isNaN(id)) {
          console.error('Please provide a valid task ID');
          break;
        }
        const tasks = await readTasks();
        const task = tasks.find(t => t.id === id);
        if (!task) {
          console.error(`Task ${id} not found`);
          break;
        }
        console.log(`\nTask ${task.id}: ${task.title}`);
        console.log(`Status: ${task.status}`);
        console.log(`Priority: ${task.priority}`);
        console.log(`Dependencies: ${task.dependencies.join(', ') || 'none'}`);
        console.log('\nDescription:');
        console.log(task.description);
        console.log('\nDetails:');
        console.log(task.details);
        console.log('\nTest Strategy:');
        console.log(task.testStrategy);
        break;
      }

      case 'set-status': {
        const id = parseInt(args[0]);
        const status = args[1];
        if (isNaN(id) || !status) {
          console.error('Please provide a valid task ID and status');
          break;
        }
        const tasks = await readTasks();
        const task = tasks.find(t => t.id === id);
        if (!task) {
          console.error(`Task ${id} not found`);
          break;
        }
        task.status = status;
        await writeTasks(tasks);
        console.log(`Task ${id} status updated to ${status}`);
        break;
      }

      case 'next': {
        const tasks = await readTasks();
        const pendingTasks = tasks.filter(task => task.status === 'pending');
        const availableTasks = pendingTasks.filter(task => {
          return task.dependencies.every(depId => {
            const depTask = tasks.find(t => t.id === depId);
            return depTask && depTask.status === 'done';
          });
        });

        if (availableTasks.length === 0) {
          console.log('No available tasks found. All tasks are either completed or blocked.');
          break;
        }

        const nextTask = availableTasks.reduce((prev, current) => {
          if (current.priority === 'high' && prev.priority !== 'high') return current;
          if (current.priority === 'medium' && prev.priority === 'low') return current;
          if (current.id < prev.id) return current;
          return prev;
        });

        console.log('\nNext task to work on:');
        console.log(`Task ${nextTask.id}: ${nextTask.title}`);
        console.log(`Priority: ${nextTask.priority}`);
        console.log('\nDescription:');
        console.log(nextTask.description);
        break;
      }

      default:
        console.log(`
Available commands:
  list              - List all tasks
  show <id>         - Show details of a specific task
  set-status <id> <status> - Update task status (pending/done)
  next              - Show the next available task to work on
        `);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
} 