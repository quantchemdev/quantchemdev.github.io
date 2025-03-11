// assets/js/members-display.js
import members from './members.js';

document.addEventListener('DOMContentLoaded', function() {
  const container = document.getElementById('members-container');
  if (!container) return;

  // Function to create a section for a category of members
  function createMemberSection(title, membersList, categoryClass) {
    if (!membersList || membersList.length === 0) return null;

    const section = document.createElement('div');
    section.className = 'member-section';

    // Create section heading
    const heading = document.createElement('h2');
    heading.textContent = title;
    section.appendChild(heading);

    // Create member list
    const list = document.createElement('ul');
    list.className = categoryClass;

    // Add each member to the list
    membersList.forEach(member => {
      const memberItem = document.createElement('li');

      // Special handling for visitors - just display name
      if (categoryClass === 'visitor') {
        const name = document.createElement('span');
        name.textContent = member.name;
        memberItem.appendChild(name);
      } else {
        // For other categories, create clickable member link
        const memberLink = document.createElement('a');
        memberLink.href = 'javascript:void(0);';
        memberLink.addEventListener('click', () => showMemberProfile(member));

        if (member.photo) {
          const photo = document.createElement('img');
          photo.src = `${site.baseurl}/assets/member_photos/${member.photo}`;
          photo.alt = member.name;
          memberLink.appendChild(photo);
        }

        const name = document.createElement('div');
        name.textContent = member.name;
        memberLink.appendChild(name);

        memberItem.appendChild(memberLink);
      }

      list.appendChild(memberItem);
    });

    section.appendChild(list);
    return section;
  }

  // Rest of the previous code remains the same...
  // (showMemberProfile function and other setup remain unchanged)

  // Define the categories with the appropriate CSS class
  const categories = [
    { title: 'Group Leaders', data: members.leaders, class: 'group-leader' },
    { title: 'Postdoctoral Researchers', data: members.postdocs, class: 'postdoc' },
    { title: 'PhD Students', data: members.phd_students, class: 'phd-student' },
    { title: 'Master Students', data: members.masters, class: 'master-student' },
    { title: 'Alumni', data: members.alumni, class: 'alumni' },
    { title: 'Visitors', data: members.visitors, class: 'visitor' }
  ];

  // Clear any existing content
  container.innerHTML = '';

  // Add site baseurl to global scope for image paths
  window.site = {
    baseurl: ''
  };

  // Only add sections that have members
  categories.forEach(category => {
    const sectionEl = createMemberSection(category.title, category.data, category.class);
    if (sectionEl) {
      container.appendChild(sectionEl);
    }
  });
});