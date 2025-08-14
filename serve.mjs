import { spawn } from 'child_process';
 
const serve = spawn('serve', ['-s', 'dist', '-l', '6002'], {
  stdio: 'inherit',
  shell: true,
});