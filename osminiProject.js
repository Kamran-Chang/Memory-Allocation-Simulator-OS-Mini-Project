const memory = [];
const jobs = {};
let technique = 1; // Default First Fit

function selectTechnique() {
  // Get the selected technique value
  const techniqueValue = document.getElementById("technique").value;

  // Update the technique description
  const description = document.getElementById("technique-description");
  description.innerText =
    techniqueValue == 1
      ? "First Fit: Allocates the first available block that fits."
      : techniqueValue == 2
      ? "Best Fit: Allocates the smallest block that fits."
      : "Worst Fit: Allocates the largest available block.";

  // Update the class for the block display
  const blockDisplay = document.getElementById("memory-display");
  blockDisplay.className =
    techniqueValue == 1
      ? "first-fit"
      : techniqueValue == 2
      ? "best-fit"
      : "worst-fit";

  // Clear input fields
  document.getElementById("memory-size-input").value = "";
  document.getElementById("job-number").value = "";
  document.getElementById("memory-required").value = "";
  document.getElementById("remove-job-input").value = "";

  // Hide memory display
  document.getElementById("memory-display").innerHTML = "";
}

function enterMemorySize() {
  const size = document.getElementById("memory-size-input").value;
  for (let i = 0; i < size; i++) {
    memory[i] = { job: null, allocated: false };
  }
  displayMemory();
}
function firstFit(jobNumber, memoryRequired) {
  let allocatedBlocks = 0;
  for (let i = 0; i < memory.length && allocatedBlocks < memoryRequired; i++) {
    if (!memory[i].allocated) {
      memory[i].allocated = true;
      memory[i].job = jobNumber;
      allocatedBlocks++;
    }
  }

  // Rest of your code remains the same
}

function bestFit(jobNumber, memoryRequired) {
  let min = Number.MAX_SAFE_INTEGER;
  let start = -1;

  // Look for the smallest free block that can accommodate memoryRequired
  for (let i = 0; i < memory.length; ) {
    if (!memory[i].allocated) {
      let j = i,
        count = 0;
      while (j < memory.length && !memory[j].allocated) {
        count++;
        j++;
      }
      if (count >= memoryRequired && count < min) {
        min = count;
        start = i;
      }
      i = j;
    } else {
      i++;
    }
  }

  if (start != -1) {
    for (let i = start; i < start + memoryRequired; i++) {
      memory[i].allocated = true;
      memory[i].job = jobNumber;
    }
  }
}

function worstFit(jobNumber, memoryRequired) {
  let max = -1;
  let start = -1;

  // Look for the largest free block
  for (let i = 0; i < memory.length; ) {
    if (!memory[i].allocated) {
      let j = i,
        count = 0;
      while (j < memory.length && !memory[j].allocated) {
        count++;
        j++;
      }
      if (count >= memoryRequired && count > max) {
        max = count;
        start = i;
      }
      i = j;
    } else {
      i++;
    }
  }

  if (start != -1) {
    for (let i = start; i < start + memoryRequired; i++) {
      memory[i].allocated = true;
      memory[i].job = jobNumber;
    }
  }
}

function addJobFun() {
  const jobNumber = document.getElementById("job-number").value;
  const memoryRequired = parseInt(
    document.getElementById("memory-required").value
  );

  // Check if job already exists
  if (jobs[jobNumber]) {
    alert("Job already exists.");
    return;
  }

  // Implement your allocation logic based on the selected technique
  let technique = parseInt(document.getElementById("technique").value);
  if (technique == 1) {
    firstFit(jobNumber, memoryRequired);
  } else if (technique == 2) {
    bestFit(jobNumber, memoryRequired);
  } else if (technique == 3) {
    worstFit(jobNumber, memoryRequired);
  }

  // Check if job was allocated
  let allocated = false;
  for (let i = 0; i < memory.length; i++) {
    if (memory[i].job == jobNumber) {
      allocated = true;
      break;
    }
  }

  if (allocated) {
    jobs[jobNumber] = true; // Mark job as entered
  } else {
    alert("Not enough memory to allocate the job.");
    // Rollback if not enough memory
    for (let i = 0; i < memory.length; i++) {
      if (memory[i].job == jobNumber) {
        memory[i].allocated = false;
        memory[i].job = null;
      }
    }
  }
  displayMemory();
}

function removeJob() {
  const jobNumber = document.getElementById("remove-job-input").value;
  // Remove the job from memory and the jobs list
  for (let i = 0; i < memory.length; i++) {
    if (memory[i].job == jobNumber) {
      memory[i].allocated = false;
      memory[i].job = null;
    }
  }
  delete jobs[jobNumber]; // Remove from the jobs list
  displayMemory();
}

function performCompaction() {
  // Implement your compaction logic here
  // For now, just re-organize the memory
  let j = 0;
  for (let i = 0; i < memory.length; i++) {
    if (memory[i].allocated) {
      memory[j++] = memory[i];
    }
  }
  for (let i = j; i < memory.length; i++) {
    memory[i] = { job: null, allocated: false };
  }
  displayMemory();
}

function displayMemory() {
  const display = document.getElementById("memory-display");
  display.innerHTML = "";
  memory.forEach((block) => {
    const div = document.createElement("div");
    div.className = "memory-block"; // Give all blocks the .memory-block class
    if (block.allocated) {
      div.className += " job"; // Add the .job class if the block is filled
      div.innerText = block.job;
    }
    display.appendChild(div);
  });
}

// Wire up the buttons
document
  .querySelector('[data-action="addJobFun"]')
  .addEventListener("click", addJobFun);
document
  .querySelector('[data-action="removeJob"]')
  .addEventListener("click", removeJob);

document.addEventListener("DOMContentLoaded", () => {
  selectTechnique(); // Initialize technique
  displayMemory(); // Display initial blocks
});
