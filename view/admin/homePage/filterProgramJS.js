document.addEventListener('DOMContentLoaded', () => {
    const filterDateButton = document.getElementById('filter-date-button');
    const dateFilterContainer = document.getElementById('date-filter-container');
    const applyDateFilterButton = document.getElementById('apply-date-filter');
    const programsListContainer = document.getElementById('programs-list-container');

    filterDateButton.addEventListener('click', () => {
        dateFilterContainer.style.display = dateFilterContainer.style.display === 'none' ? 'block' : 'none';
    });

    applyDateFilterButton.addEventListener('click', () => {
        const selectedDate = document.getElementById('filter-date-input').value;
        if (selectedDate) {
            const formattedDate = formatDate(selectedDate);
            filterProgramsByDate(selectedDate);
        }
    });

    function formatDate(date) {
        const [year, month, day] = date.split('-');
        return `${year}-${month}-${day}`;
    }

    function filterProgramsByDate(date) {
        const data = {
            date_time: date
        };

        fetch('../../../api/filterProgram.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'Success') {
                displayPrograms(data.programs);
                console.log('date exist');
            } else {
                programsListContainer.innerHTML = '<p>No programs found for the specified date.</p>';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while fetching the programs.');
        });
    }

    function displayPrograms(programs) {
        programsListContainer.innerHTML = '';

        programs.forEach(program => {
            const programElement = document.createElement('div');
            programElement.classList.add('program-box'); // Add the class for the program box
            programElement.innerHTML = `
                <h3>${program.name}</h3>
                <p>Date: ${new Date(program.date_time).toLocaleDateString()}</p>
                <p>Time: ${new Date(program.date_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                <p>Participants: ${program.total_participant} / ${program.participant_limit}</p>
                <p>Location: ${program.location}</p>
                <p>Status: ${program.status}</p>
            `;
            programsListContainer.appendChild(programElement);
        });
    }
});
