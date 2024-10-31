// eslint-disable-next-line @typescript-eslint/no-unused-vars
"use client"

import {
  Atom,
  Bird,
  BookOpen,
  Bot,
  Code2,
  Eclipse,
  Frame,
  History,
  LifeBuoy,
  Map,
  PieChart,
  Rabbit,
  Send,
  Settings2,
  SquareTerminal,
  Star,
  Turtle,
  Microscope,
  ChartColumn,
  FilePlus,
  Vote,
  Headphones
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import { StorageCard } from "@/components/storage-card"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarItem,
  SidebarLabel,
} from "@/components/ui/sidebar"

import {Poppy} from '@/components/poppy';
import {PollCreation} from '@/components/poll-components/poll-create';
import { PollResults } from "@/components/poll-components/poll-results";
import { PollVoting } from "@/components/poll-components/poll-voting";
import { ScrollArea } from "@/components/ui/scroll-area"
// import AddAnnotation from "@/components/add-annotation"





const data = {
  teams: [
    {
      name: "Hagen",
      logo: Atom,
      plan: "Solar Power 2025",
    },
    {
      name: "Bad Berleburg",
      logo: Eclipse,
      plan: "Wind Energy 2030",
    },
    {
      name: "Berlin",
      logo: Headphones,
      plan: "Wind and Solar",
    },
  ],
  user: {
    name: "Stefan",
    email: "stefan@awesome.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Scenarios",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "History",
          url: "#",
          icon: History,
          description: "View your recent prompts",

        },
        {
          title: "Starred",
          url: "#",
          icon: Star,
          description: "Browse your starred prompts",
        },
        {
          title: "Settings",
          url: "#",
          icon: Settings2,
          description: "Configure your playground",
        },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Generator",
          url: "#",
          icon: Rabbit,
          description: "Our fastest model for general use cases.",
        },
        {
          title: "Explorer",
          url: "#",
          icon: Bird,
          description: "Performance and speed for efficiency.",
        },
        {
          title: "Uploader",
          url: "#",
          icon: Turtle,
          description: "The most powerful model for complex computations.",
        },

      ],
    },
    {
      title: "Research",
      url: "#",
      icon: Microscope,
      items: [
        {
          title: "Create Poll",
          url: "#",
          icon: FilePlus,
        },
        {
          title: "View Polls",
          url: "#",
          icon: ChartColumn
        },
        {
          title: "Vote in Polls",
          url: "#",
          icon: Vote
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "API",
      url: "#",
      icon: Code2,
      items: [
        {
          title: "GIS",
          url: "#",
        },
        {
          title: "Enviromental-Database",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
      ],
    },
  ],

  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
  projects: [
    {
      name: "Rural Planning",
      url: "#",
      icon: Frame,
    },
    {
      name: "Socio-Economic Analysis",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Geo-Spatial Analysis",
      url: "#",
      icon: Map,
    },
  ],
  searchResults: [
    {
      title: "Find Local XR Participation Projects",
      teaser:
        "Explore wind energy projects and other local initiatives using immersive XR technology. Discover how to get involved and contribute your insights through interactive experiences.",
      url: "#",
    },
    {
      title: "Customize Your XR Experience",
      teaser:
        "Learn how to adjust the XR interface to suit your needs. Use intuitive layouts and templates to personalize how you view and interact with project data in real-time.",
      url: "#",
    },
    {
      title: "Access Real-Time Project Data",
      teaser:
        "Stay up-to-date with the latest information from ongoing projects. This feature lets you view live data, community feedback, and expert opinions seamlessly within the XR environment.",
      url: "#",
    },
    {
      title: "Collaborate with Other Stakeholders",
      teaser:
        "Work together with citizens, experts, and project developers in real-time. Use XR’s immersive tools to visualize changes and understand different perspectives on project decisions.",
      url: "#",
    },
    {
      title: "Submit Feedback and Propose Changes",
      teaser:
        "Have your voice heard! Use this feature to submit feedback or propose adjustments to project designs, directly interacting with the project’s data and simulations in XR.",
      url: "#",
    },
  ]

}

export function AppSidebar() {

  return (
  
    <Sidebar>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <ScrollArea className="h-full">
      <SidebarContent>
        <SidebarItem>
          <SidebarLabel>Admin</SidebarLabel>
          <NavMain items={data.navMain} searchResults={data.searchResults} />
        </SidebarItem>
        <SidebarItem>
          <SidebarLabel>Projects</SidebarLabel>
          <NavProjects projects={data.projects} />
        </SidebarItem>
        <SidebarItem>
          <SidebarLabel>Research</SidebarLabel>
          <NavProjects projects={data.projects} />
        </SidebarItem>
        <SidebarItem className="mt-auto">
        </SidebarItem>
        <SidebarItem className="mt-auto">
          <PollCreation/>
        </SidebarItem>
        <SidebarItem className="mt-auto">
          <Poppy />
        </SidebarItem>
        <SidebarItem className="mt-auto">
          <PollResults />
        </SidebarItem>
        <SidebarItem className="mt-auto">
          <PollVoting />
        </SidebarItem>
          <SidebarItem>
          <SidebarLabel>Support</SidebarLabel>
          <NavSecondary items={data.navSecondary} />
        </SidebarItem>
        <SidebarItem>
          <StorageCard />
        </SidebarItem>
      </SidebarContent>
      </ScrollArea>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>         
  )
};
