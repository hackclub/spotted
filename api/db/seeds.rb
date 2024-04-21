# Seeder script for Ruby on Rails

# Define the names for teams and users
TEAM_NAMES = ['LA Hacks', 'TreeHacks', 'HackDavis']
USER_NAMES = ['Alice', 'Bob', 'Charlie', 'David', 'Emma', 'Frank', 'Grace', 'Henry', 'Ivy', 'Jack']

# Define the number of spots per member
NUM_SPOTS_PER_MEMBER = 3
counter = 20

# Create users
users = USER_NAMES.map do |name|
  u = User.create!(
    email: "sampoder+#{counter}@berkeley.edu",
    password: 'password', # Example password
    name: name
    # Add any other attributes you want to generate
  )
  counter = counter + 1

  u
end

# Create teams
teams = TEAM_NAMES.map do |name|
  u = users.sample
  t = Team.create!(
    name: name,
    creator: u
  )
  Member.create!(
    user: u,
    team: t
  )
end

# Create members for each team
teams.each do |team|
  User.where.not(id: team.creator.id).sample(5).each do |user|
    Member.create!(
      user: user,
      team: team
    )
  end
end

# Create spots for each member
Member.all.each do |member|
  NUM_SPOTS_PER_MEMBER.times do
    Spot.create!(
      spotter: member.user,
      spotted: member.team.members.all.sample
    )
  end
end

puts "Seed data generated successfully!"
