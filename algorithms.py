# =========================================================
# CPU SCHEDULING SIMULATOR
# Algorithms:
# 1- FCFS
# 2- Round Robin
# 3- Priority Non-Preemptive
# 4- Priority Preemptive
# =========================================================


# =========================================================
# PROCESS CLASS
# =========================================================

class Process:

    def __init__(
        self,
        pid,
        arrival,
        burst,
        priority=0
    ):

        # USER INPUT
        self.pid = pid
        self.arrival = arrival
        self.burst = burst
        self.priority = priority

        # USED FOR RR + PREEMPTIVE
        self.remaining = burst

        # RESULTS
        self.completion = 0
        self.turnaround = 0
        self.waiting = 0
        self.response = -1


# =========================================================
# RESET PROCESSES
# =========================================================

def reset_processes(processes):

    for p in processes:

        p.remaining = p.burst

        p.completion = 0
        p.turnaround = 0
        p.waiting = 0
        p.response = -1


# =========================================================
# FCFS
# =========================================================

def fcfs(processes):

    processes.sort(
        key=lambda x: x.arrival
    )

    current_time = 0

    for p in processes:

        if current_time < p.arrival:

            current_time = p.arrival

        # RESPONSE
        p.response = (
            current_time - p.arrival
        )

        # EXECUTE
        current_time += p.burst

        # COMPLETION
        p.completion = current_time

        # TURNAROUND
        p.turnaround = (
            p.completion - p.arrival
        )

        # WAITING
        p.waiting = (
            p.turnaround - p.burst
        )

        return processes


# =========================================================
# ROUND ROBIN
# =========================================================

def round_robin(processes, quantum):

    processes.sort(
        key=lambda x: x.arrival
    )

    current_time = 0

    queue = []

    completed = 0

    n = len(processes)

    visited = [False] * n

    while completed < n:

        # ADD ARRIVED PROCESSES
        for i in range(n):

            if (
                processes[i].arrival <= current_time
                and visited[i] == False
            ):

                queue.append(processes[i])
                visited[i] = True

        # CPU IDLE
        if len(queue) == 0:

            current_time += 1
            continue

        current = queue.pop(0)

        # RESPONSE
        if current.response == -1:

            current.response = (
                current_time - current.arrival
            )

        # EXECUTE
        if current.remaining > quantum:

            current.remaining -= quantum
            current_time += quantum

        else:

            current_time += current.remaining

            current.remaining = 0

            current.completion = current_time

            current.turnaround = (
                current.completion
                - current.arrival
            )

            current.waiting = (
                current.turnaround
                - current.burst
            )

            completed += 1

        # ADD NEW ARRIVED
        for i in range(n):

            if (
                processes[i].arrival <= current_time
                and visited[i] == False
            ):

                queue.append(processes[i])
                visited[i] = True

        # RETURN TO QUEUE
        if current.remaining > 0:

            queue.append(current)
        return processes


# =========================================================
# PRIORITY NON PREEMPTIVE
# =========================================================

def priority_non_preemptive(processes):

    current_time = 0

    completed = []

    while len(completed) < len(processes):

        ready_queue = []

        for p in processes:

            if (
                p.arrival <= current_time
                and p not in completed
            ):

                ready_queue.append(p)

        # CPU IDLE
        if len(ready_queue) == 0:

            current_time += 1
            continue

        # HIGHEST PRIORITY
        current = min(
            ready_queue,
            key=lambda x: x.priority
        )

        # RESPONSE
        current.response = (
            current_time - current.arrival
        )

        # EXECUTE
        current_time += current.burst

        current.completion = current_time

        current.turnaround = (
            current.completion
            - current.arrival
        )

        current.waiting = (
            current.turnaround
            - current.burst
        )

        completed.append(current)
        return processes


# =========================================================
# PRIORITY PREEMPTIVE
# =========================================================

def priority_preemptive(processes):

    current_time = 0

    completed = 0

    n = len(processes)

    while completed < n:

        ready_queue = []

        for p in processes:

            if (
                p.arrival <= current_time
                and p.remaining > 0
            ):

                ready_queue.append(p)

        # CPU IDLE
        if len(ready_queue) == 0:

            current_time += 1
            continue

        # SELECT PROCESS
        current = min(
            ready_queue,
            key=lambda x: x.priority
        )

        # RESPONSE
        if current.response == -1:

            current.response = (
                current_time - current.arrival
            )

        # EXECUTE 1 UNIT
        current.remaining -= 1

        current_time += 1

        # FINISHED
        if current.remaining == 0:

            completed += 1

            current.completion = current_time

            current.turnaround = (
                current.completion
                - current.arrival
            )

            current.waiting = (
                current.turnaround
                - current.burst
            )
        return processes
             
        
